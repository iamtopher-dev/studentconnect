<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentInformation;
use App\Models\StudentUpdateRequests;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{

    public function submitAdmission(Request $request)
    {
        $request->validate([
            "family_name" => "required|string|max:255",
            "first_name" => "required|string|max:255",
            "middle_name" => "nullable|string|max:255",
            "major" => "required|string|max:50",
            "applicant_type" => "required|string|max:50",
            "year_level" => "required|string|max:10",
            "dob" => "required|date",
            "place_of_birth" => "required|string|max:255",
            "street" => "required|string|max:255",
            "barangay" => "required|string|max:255",
            "municipality" => "required|string|max:255",
            "province" => "nullable|string|max:255",
            "nationality" => "required|string|max:100",
            "sex" => "required|string|max:10",
            "civil_status" => "required|string|max:20",
            "religion" => "nullable|string|max:50",
            "email" => "required|email",
            "guardian_name" => "required|string|max:255",
            "guardian_contact_number" => "required|string|max:20",
            "isAccept" => "boolean",
        ]);

        $student = StudentInformation::create($request->all());

        return response()->json([
            "success" => true,
            "message" => "Admission submitted successfully",
            "data" => $student
        ]);
    }

    public function getEnrolledSubject()
    {
        // return Auth::id();
        $user = User::with([
            'studentInformation',
            'enrolledSubjects' => function ($query) {
                $query->join('student_information', 'student_subjects.user_id', '=', 'student_information.student_information_id')
                    ->whereColumn('student_subjects.year_level', 'student_information.year_level')
                    ->whereColumn('student_subjects.semester', 'student_information.semester')
                    ->select('student_subjects.*'); // important to only select student_subjects columns
            }
        ])->find(Auth::id());

        return response()->json([
            "success" => true,
            "data" => $user
        ]);
    }

    public function generateGradeReport(Request $request)
    {
        $user = User::with([
            'studentInformation',
            'enrolledSubjects' => function ($query) use ($request) {
                $query->where('year_level', $request->year_level)
                    ->where('semester', $request->semester);
            }
        ])->find(Auth::id());

        return response()->json([
            "success" => true,
            "data" => $user
        ]);
    }

    public function updateInformation(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'type' => 'required|in:student,personal,guardian',
            'data' => 'required|array',
        ]);

        $studentInfo = StudentInformation::where(
            'student_information_id',
            $user->student_information_id
        )->first();

        if (!$studentInfo) {
            return response()->json([
                'message' => 'Student information not found'
            ], 404);
        }

        StudentUpdateRequests::create([
            'student_information_id' => $studentInfo->student_information_id,
            'type' => $request->type,
            'data' => $request->data,
        ]);

        return response()->json([
            'message' => 'Update request submitted for admin review'
        ], 201);
    }
}
