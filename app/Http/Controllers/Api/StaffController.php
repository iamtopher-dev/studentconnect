<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Models\StudentInformation;
use App\Models\StudentSubjects;
use App\Models\StudentUpdateRequests;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    public function dashboard()
    {
        $totalStudents = User::where('role', 'STUDENT')->count();
        $totalIncomingStudents = StudentInformation::where('isAccept', false)->count();

        return response()->json([
            "total_students" => $totalStudents,
            "total_incoming_students" => $totalIncomingStudents
        ]);
    }
    public function getIncomingStudents()
    {
        $students = StudentInformation::where('isAccept', false)->get();
        return response()->json([
            "success" => true,
            "data" => $students
        ]);
    }

    public function acceptStudent($id, Request $request)
    {
        $student = StudentInformation::find($id);

        if (!$student) {
            return response()->json([
                "success" => false,
                "message" => "Student not found"
            ], 404);
        }
        $student->isAccept = true;

        if ($request["applicant_type"] == "SHS") {
            $student->section = $request["section"] . substr($request["year_level"], -1);
        } else {
            $student->section = $request["year_level"][0] . $request["section"];
        }

        $student->semester = $request["semester"];
        $student->school_year = date('Y') . '-' . (date('Y') + 1);
        if ($student->save()) {
            $user = new User();
            $user->name        = $request["first_name"] . ' ' . $request["family_name"];
            $user->email       = $request["email"];
            $user->student_no  =  $request["studentId"];
            $user->student_information_id = $student->student_information_id;
            $user->role        = 'STUDENT';

            // Francisco1234
            $generatedPassword = $request['family_name'] . substr($request['studentId'], -4);

            $user->password = Hash::make($generatedPassword);
            $user->save();
            $userId = $user->student_information_id;
            if ($request['studentType'] == "Irregular") {
                foreach ($request['selectedSubjects'] as $subject) {

                    $curriculumSubjects = Curriculum::where('id', $subject['value'])->first();
                    StudentSubjects::create([
                        "user_id" => $userId,
                        "subject_name" => $curriculumSubjects->subject_name,
                        "subject_code" => $curriculumSubjects->code,
                        "subject_units" => $curriculumSubjects->units,
                        "school_year" => date('Y') . '-' . (date('Y') + 1),
                        "year_level" => $request['year_level'],
                        "semester" => $request['semester']
                    ]);
                }
            } else {
                $curriculumSubjects = Curriculum::where('course', $request['major'])
                    ->where('year', $request['year_level'])
                    ->where('semester', $request['semester'])
                    ->get();

                foreach ($curriculumSubjects as $subject) {
                    StudentSubjects::create([
                        "user_id" => $userId,
                        "subject_name" => $subject->subject_name,
                        "subject_code" => $subject->code,
                        "subject_units" => $subject->units,
                        "school_year" => date('Y') . '-' . (date('Y') + 1),
                        "year_level" => $request['year_level'],
                        "semester" => $request['semester']
                    ]);
                }
            }
            return response()->json([
                "success" => true,
                "message" => "Student accepted successfully"
            ]);
        } else {
            return response()->json([
                "success" => false,
                "message" => "Failed to accept student"
            ], 500);
        }
    }

    public function getStudents()
    {
        $students = User::where('role', 'STUDENT')
            ->whereHas('studentInformation', function ($query) {
                $query->where('isAccept', true);
            })
            ->with([
                'studentInformation',
                'enrolledSubjects' => function ($query) {
                    $query->join('student_information', 'student_subjects.user_id', '=', 'student_information.student_information_id')
                        ->whereColumn('student_subjects.year_level', 'student_information.year_level')
                        ->whereColumn('student_subjects.semester', 'student_information.semester')
                        ->select('student_subjects.*'); // important to select student_subjects fields
                }
            ])
            ->get();

        return response()->json([
            "success" => true,
            "data" => $students
        ]);
    }

    public function saveStudentsGrades(Request $request)
    {

        $data = $request->validate([
            'student_id' => 'required|integer',
            'grades' => 'required|array',
            'grades.*.student_subject_id' => 'required|integer|exists:student_subjects,student_subject_id',
            'grades.*.grade' => 'nullable|string|max:5'
        ]);

        foreach ($data['grades'] as $subjectGrade) {
            StudentSubjects::where('student_subject_id', $subjectGrade['student_subject_id'])
                ->update(['grades' => $subjectGrade['grade']]); // single associative array
        }

        return response()->json(['message' => 'Grades saved successfully']);
    }

    public function saveStudentGradesByExcel(Request $request)
    {
        $course = $request->input('course');
        $section = $request->input('section');
        $subjectCode = $request->input('subjectCode');
        $grades = $request->input('grades', []);

        foreach ($grades as $item) {
            $fullName = $item['fullName'] ?? '';
            $finalGrade = $item['finalGrade'] ?? null;

            if (!$fullName || $finalGrade === null) {
                continue;
            }

            $cleanFullName = preg_replace('/[^a-zA-Z0-9 ]/', '', $fullName);

            $nameParts = array_filter(explode(' ', $cleanFullName), fn($v) => !empty($v));

            $student = StudentInformation::where(function ($query) use ($nameParts) {
                foreach ($nameParts as $part) {
                    $query->where(function ($q) use ($part) {
                        $q->where('family_name', $part)
                            ->orWhere('first_name', 'LIKE', "%{$part}%")
                            ->orWhereRaw('LEFT(middle_name, 1) = ?', [$part]);
                    });
                }
            })
                ->where('section', $section)
                ->where('major', $course)
                ->first();

            if ($student) {
                StudentSubjects::where('user_id', $student->student_information_id)
                    ->where('subject_code', $subjectCode)
                    ->where('semester', $student->semester)
                    ->where('year_level', $student->year_level)
                    ->update([
                        'grades' => round($finalGrade),
                    ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Grades saved successfully.',
        ]);
    }

    public function getReEnrollStudentsRegular($student_id)
    {



        $studentInformation = StudentInformation::where('student_information_id', $student_id)->first();

        if ($studentInformation->semester === '1st Semester') {
            $studentInformation->semester = '2nd Semester';
        } else {
            $studentInformation->semester = '1st Semester';

            $studentInformation->year_level = match ($studentInformation->year_level) {
                '1st Year' => '2nd Year',
                '2nd Year' => '3rd Year',
                '3rd Year' => '4th Year',
                default => $studentInformation->year_level,
            };

            if (preg_match('/(\d)([A-Z])/i', $studentInformation->section, $matches)) {
                $currentNumber = (int)$matches[1];
                $sectionLetter = strtoupper($matches[2]);

                $studentInformation->section = ($currentNumber + 1) . $sectionLetter;
            }
        }

        $studentInformation->save();

        $curriculumSubjects = Curriculum::where('course', $studentInformation->major)
            ->where('year', $studentInformation->year_level)
            ->where('semester', $studentInformation->semester)
            ->get();

        foreach ($curriculumSubjects as $subject) {
            StudentSubjects::create([
                "user_id" => $studentInformation->student_information_id,
                "subject_name" => $subject->subject_name,
                "subject_code" => $subject->code,
                "subject_units" => $subject->units,
                "school_year" => date('Y') . '-' . (date('Y') + 1),
                "year_level" => $studentInformation->year_level,
                "semester" => $studentInformation->semester
            ]);
        }

        return response()->json([
            "success" => true,
            "message" => "Student re-enrolled successfully"
        ]);
    }

    public function getReEnrollStudentsIrregular(Request $request)
    {
        $request->validate([
            'student_information_id' => 'required',
            'subjects' => 'required|array',
        ]);

        $studentInformation = StudentInformation::where(
            'student_information_id',
            $request->student_information_id
        )->firstOrFail();

        if ($studentInformation->semester === '1st Semester') {
            $studentInformation->semester = '2nd Semester';
        } else {
            $studentInformation->semester = '1st Semester';

            $studentInformation->year_level = match ($studentInformation->year_level) {
                '1st Year' => '2nd Year',
                '2nd Year' => '3rd Year',
                '3rd Year' => '4th Year',
                default => $studentInformation->year_level,
            };
            if (preg_match('/(\d)([A-Z])/i', $studentInformation->section, $matches)) {
                $currentNumber = (int)$matches[1];
                $sectionLetter = strtoupper($matches[2]);

                $studentInformation->section = ($currentNumber + 1) . $sectionLetter;
            }
        }

        $studentInformation->save();

        $curriculumSubjects = Curriculum::whereIn('id', $request->subjects)->get();

        foreach ($curriculumSubjects as $subject) {
            StudentSubjects::create([
                'user_id'       => $studentInformation->student_information_id,
                'subject_name'  => $subject->subject_name,
                'subject_code'  => $subject->code,
                'subject_units' => $subject->units,
                'school_year'   => date('Y') . '-' . (date('Y') + 1),
                'year_level'    => $studentInformation->year_level,
                'semester'      => $studentInformation->semester,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Irregular student re-enrolled successfully',
        ]);
    }

    public function get_request_update_information_student()
    {
        $all_request = StudentUpdateRequests::with(['student', 'user'])->get();
        return response()->json([
            'success' => true,
            'data' => $all_request
        ]);
    }

    public function approvedRequestInformation($student_update_request_id)
    {
        $student_update_request = StudentUpdateRequests::where('student_update_request_id', $student_update_request_id)->first();
        if ($student_update_request->type === "student") {
            StudentInformation::where('student_information_id', $student_update_request->student_information_id)->update(
                [
                    'family_name' => $student_update_request->data['lastName'],
                    'middle_name' => $student_update_request->data['middleName'],
                    'first_name' => $student_update_request->data['firstName']
                ]
            );
        }
        if ($student_update_request->type === "personal") {
            StudentInformation::where('student_information_id', $student_update_request->student_information_id)->update(
                [
                    'street' => $student_update_request->data['street'],
                    'barangay' => $student_update_request->data['barangay'],
                    'municipality' => $student_update_request->data['municipality'],
                    'province' => $student_update_request->data['province'],
                    'dob' => $student_update_request->data['dob'],
                    'sex' => $student_update_request->data['sex'],
                    'civil_status' => $student_update_request->data['civilStatus'],
                    'nationality' => $student_update_request->data['nationality'],
                    'religion' => $student_update_request->data['religion']
                ]
            );
        }
        if ($student_update_request->type === "guardian") {
            StudentInformation::where('student_information_id', $student_update_request->student_information_id)->update(
                [
                    'guardian_name' => $student_update_request->data['guardianName'],
                    'guardian_contact_number' => $student_update_request->data['guardianContact']
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Request approved successfully'
        ]);
    }
    public function releaseGradesStudents(Request $request)
    {
        $subjects = $request->subjects; // array of subject objects

        $subjectIds = collect($subjects)->pluck('student_subject_id');

        $hasEmptyGrades = StudentSubjects::whereIn('student_subject_id', $subjectIds)
            ->whereNull('grades')
            ->exists();

        if ($hasEmptyGrades) {
            return response()->json([
                'success' => false,
                'message' => 'Some grades are still missing. Please complete all grades before releasing.'
            ]);
        } else {
            StudentSubjects::whereIn('student_subject_id', $subjectIds)->update([
                'isReleased' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'All grades have been successfully completed and released.'
            ]);
        }
    }
}
