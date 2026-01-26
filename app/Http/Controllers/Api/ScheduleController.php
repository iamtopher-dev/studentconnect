<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function save_schedule_pdf(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,xlsx,xls|max:10240',
        ]);

        $final_file_info = '';

        if ($request->hasFile('file')) {
            $file = $request->file('file'); // use correct input name
            $filename = time() . '_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/schedule');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $final_file_info = '/uploads/schedule/' . $filename;
        }

        $schedule = Schedule::create([
            'pdf_file' => $final_file_info,
            'schedule_for' => 'COLLEGE',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'path' => $final_file_info,
            'data' => $schedule,
        ]);
    }

    public function read_schedule_pdf($schedule_for)
    {
        $schedule = Schedule::where('schedule_for', $schedule_for)->orderBy('created_at', 'desc')->limit(1)->first();
        return response()->json([
            "success" => true,
            "data" => $schedule
        ]);
    }
}
