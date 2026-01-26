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

        /* PROGRAMS */
        $collegePrograms = ["BSIT", "BSCPE", "BSBA"];
        $shsPrograms = ["ICT", "ABM", "HE"];

        /* EMPTY STRUCTURES */
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

        /* INITIALIZE RESULT */
        $result = [
            "College" => [],
            "SHS" => [],
        ];

        /* INIT COLLEGE */
        foreach ($collegePrograms as $prog) {
            $result["College"][$prog] = $emptyCollegeYears;
        }

        /* INIT SHS */
        foreach ($shsPrograms as $prog) {
            $result["SHS"][$prog] = $emptyShsYears;
        }

        /* POPULATE DATA */
        foreach ($curriculums as $item) {
            $level    = $item->curriculum_for === "COLLEGE" ? "College" : "SHS";
            $program  = $item->course;
            $year     = $item->year;
            $semester = $item->semester;

            if (isset($result[$level][$program][$year][$semester])) {
                $result[$level][$program][$year][$semester][] = [
                    "id"    => $item->id,
                    "code"  => $item->code,
                    "name"  => $item->subject_name,
                    "units" => $item->units,
                ];
            }
        }

        return response()->json($result, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'level'    => 'required|in:College,SHS',
            'program'  => 'required|string',
            'year'     => 'required|string',
            'semester' => 'nullable|required_if:level,College|string',
            'code'     => 'required|string|max:50',
            'name'     => 'required|string|max:255',
            'units'    => 'required|integer',
        ]);

        $curriculum = Curriculum::create([
            'course'         => $validated['program'],
            'year'           => $validated['year'],
            'semester'       => $validated['semester'] ?? null,
            'code'           => $validated['code'],
            'subject_name'   => $validated['name'],
            'units'          => $validated['units'],
            'curriculum_for' => strtoupper($validated['level']), // COLLEGE | SHS
        ]);

        return response()->json([
            'message' => 'New subject added successfully',
            'data'    => $curriculum
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'field' => 'required|string|in:code,code_no,description,hours_lec,hours_lab,units,coreq,prereq,total_hours_week,teacher_id',
        ]);

        $curriculum = Curriculum::find($id);

        if (!$curriculum) {
            return response()->json(['message' => 'Curriculum not found'], 404);
        }

        $curriculum->update([
            $request->input('field') => $request->input('value'),
        ]);

        return response()->json(['data' => $curriculum], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $curriculum = Curriculum::find($id);
        if (!$curriculum->delete()) {
            return response()->json(['error' => 'Row removed not successfull'], 400);
        }

        return response()->json(['message' => 'Row removed successfully'], 200);
    }
}
