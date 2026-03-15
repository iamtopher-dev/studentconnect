<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use Illuminate\Http\Request;

class CurriculumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $curriculums = Curriculum::all();

        $collegePrograms = ["BSIT", "BSCPE", "BSBA"];
        $shsPrograms = ["ICT", "ABM", "HE", "IA"];

        $emptyCollegeYears = [
            "1st Year" => ["1st Semester" => [], "2nd Semester" => []],
            "2nd Year" => ["1st Semester" => [], "2nd Semester" => []],
            "3rd Year" => ["1st Semester" => [], "2nd Semester" => []],
            "4th Year" => ["1st Semester" => [], "2nd Semester" => []],
        ];

        $emptyShsYears = [
            "Grade 11" => ["1st Semester" => [], "2nd Semester" => []],
            "Grade 12" => ["1st Semester" => [], "2nd Semester" => []],
        ];

        $result = [
            "College" => [],
            "SHS" => [],
        ];

        foreach ($collegePrograms as $prog) {
            $result["College"][$prog] = $emptyCollegeYears;
        }

        foreach ($shsPrograms as $prog) {
            $result["SHS"][$prog] = $emptyShsYears;
        }

        foreach ($curriculums as $item) {
            $level    = $item->curriculum_for === "COLLEGE" ? "College" : "SHS";
            $program  = $item->course;
            $year     = $item->year;
            $semester = $item->semester ?? "1st Semester";

            if (isset($result[$level][$program][$year][$semester])) {
                $result[$level][$program][$year][$semester][] = [
                    "id"         => $item->id,
                    "code"       => $item->code,
                    "name"       => $item->subject_name,
                    "units"      => $item->units,
                    "instructor" => $item->instructor,
                ];
            }
        }

        return response()->json($result, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'level'      => 'required|in:College,SHS',
            'program'    => 'required|string',
            'year'       => 'required|string',
            'semester'   => 'nullable|required_if:level,College|string',
            'code'       => 'required|string|max:50',
            'name'       => 'required|string|max:255',
            'units'      => 'required|integer',
            'instructor' => 'required|string',
        ]);

        $curriculum = Curriculum::create([
            'course'         => $validated['program'],
            'year'           => $validated['year'],
            'semester'       => $validated['semester'] ?? null,
            'code'           => $validated['code'],
            'subject_name'   => $validated['name'],
            'units'          => $validated['units'],
            'curriculum_for' => strtoupper($validated['level']),
            'instructor'     => $validated['instructor'],
        ]);

        return response()->json([
            'message' => 'New subject added successfully',
            'data'    => $curriculum,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($course)
    {
        $curriculum = Curriculum::where('course', $course)->get();
        return response()->json(["data" => $curriculum], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $curriculum = Curriculum::findOrFail($id);

        $validated = $request->validate([
            'level'      => 'required|in:College,SHS',
            'program'    => 'required|string',
            'year'       => 'required|string',
            'semester'   => 'nullable|required_if:level,College|string',
            'code'       => 'required|string|max:50',
            'name'       => 'required|string|max:255',
            'units'      => 'required|integer',
            'instructor' => 'required|string',
        ]);

        $curriculum->update([
            'course'         => $validated['program'],
            'year'           => $validated['year'],
            'semester'       => $validated['semester'] ?? null,
            'code'           => $validated['code'],
            'subject_name'   => $validated['name'],
            'units'          => $validated['units'],
            'curriculum_for' => strtoupper($validated['level']),
            'instructor'     => $validated['instructor'],
        ]);

        return response()->json([
            'message' => 'Subject updated successfully',
            'data'    => $curriculum,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $curriculum = Curriculum::find($id);

        if (!$curriculum->delete()) {
            return response()->json(['error' => 'Row removal unsuccessful'], 400);
        }

        return response()->json(['message' => 'Row removed successfully'], 200);
    }
}
