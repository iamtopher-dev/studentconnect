<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CoursesController;
use App\Http\Controllers\Api\CurriculumController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentSubjectController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use function Symfony\Component\String\s;

Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class, "login"]);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::post('admissions', [StudentController::class, 'submitAdmission']);

Route::get('student/get-student-information', [StudentController::class, 'getEnrolledSubject'])->middleware('auth:sanctum');
Route::post('student/generate-grade-report', [StudentController::class, 'generateGradeReport'])->middleware('auth:sanctum');
Route::post('student/update-information', [StudentController::class, 'updateInformation'])->middleware('auth:sanctum');


Route::get('staff/dashboard', [StaffController::class, 'dashboard'])->middleware('auth:sanctum');
Route::get('staff/get-request-update-information-student', [StaffController::class, 'get_request_update_information_student'])->middleware('auth:sanctum');
Route::get('staff/student', [StaffController::class, 'getStudents'])->middleware('auth:sanctum');
Route::post('staff/save-student-grades', [StaffController::class, 'saveStudentsGrades'])->middleware('auth:sanctum');
Route::post('staff/save-student-grades-by-excel', [StaffController::class, 'saveStudentGradesByExcel'])->middleware('auth:sanctum');
Route::get('staff/re-enroll-regular/{student_id}', [StaffController::class, 'getReEnrollStudentsRegular'])->middleware('auth:sanctum');
Route::post('staff/re-enroll-irregular', [StaffController::class, 'getReEnrollStudentsIrregular'])->middleware('auth:sanctum');

Route::post('staff/save-schedule-pdf', [ScheduleController::class, 'save_schedule_pdf'])->middleware('auth:sanctum');
Route::get('staff/read-schedule-pdf/{schedule_for}', [ScheduleController::class, 'read_schedule_pdf'])->middleware('auth:sanctum');

Route::get('staff/approve-request-information/{student_update_request_id}', [StaffController::class, 'approvedRequestInformation'])->middleware('auth:sanctum');


// Staff Controllers
Route::get('staff/incoming-students', [StaffController::class, 'getIncomingStudents']);
Route::post('staff/accept-student/{id}', [StaffController::class, 'acceptStudent']);

Route::apiResource('curriculum', CurriculumController::class)->except(['show']);
Route::get('curriculum/{course}', [CurriculumController::class, 'show']);
