<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CurriculumController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;

Route::middleware('web')->group(function () {
    Route::post("register", [AuthController::class, "register"]);
    Route::post("login", [AuthController::class, "login"]);
    Route::post('admissions', [StudentController::class, 'submitAdmission']);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {

    Route::get('get-user-logged', [AuthController::class, 'getUserLogged']);

    Route::middleware([RoleMiddleware::class . ':STUDENT'])->group(function () {
        Route::get('student/get-student-information', [StudentController::class, 'getEnrolledSubject']);
        Route::post('student/generate-grade-report', [StudentController::class, 'generateGradeReport']);
        Route::post('student/update-information', [StudentController::class, 'updateInformation']);
    });

    Route::middleware([RoleMiddleware::class . ':STAFF'])->group(function () {
        Route::get('staff/dashboard', [StaffController::class, 'dashboard']);
        Route::get('staff/get-request-update-information-student', [StaffController::class, 'get_request_update_information_student']);
        Route::get('staff/student', [StaffController::class, 'getStudents']);
        Route::post('staff/save-student-grades', [StaffController::class, 'saveStudentsGrades']);
        Route::post('staff/save-student-grades-by-excel', [StaffController::class, 'saveStudentGradesByExcel']);
        Route::get('staff/re-enroll-regular/{student_id}', [StaffController::class, 'getReEnrollStudentsRegular']);
        Route::post('staff/re-enroll-irregular', [StaffController::class, 'getReEnrollStudentsIrregular']);
        Route::get('staff/approve-request-information/{student_update_request_id}', [StaffController::class, 'approvedRequestInformation']);
        Route::get('staff/incoming-students', [StaffController::class, 'getIncomingStudents']);
        Route::post('staff/release-grades-students/{id}', [StaffController::class, 'releaseGradesStudents']);
        Route::post('staff/accept-student/{id}', [StaffController::class, 'acceptStudent']);
        Route::apiResource('/staff/teachers', TeacherController::class)->except(['show']);
        Route::get('staff/get-curriculum/{course}/{semester}/{year}', [StaffController::class, 'getCurriculum']);
        Route::get('staff/drop-subject/{id}', [StaffController::class, 'dropSubject']);
    });

    Route::middleware([RoleMiddleware::class . ':STAFF'])->group(function () {
        Route::apiResource('curriculum', CurriculumController::class)->except(['show']);
        Route::get('curriculum/{course}', [CurriculumController::class, 'show']);
    });
});
