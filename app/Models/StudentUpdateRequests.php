<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentUpdateRequests extends Model
{
    protected $table = "student_update_requests";
    protected $primaryKey = 'student_update_request_id';
    protected $fillable = [
        "student_information_id",
        "type",
        "data",
        "status",
        "reviewed_by",
        "reviewed_at",
    ];
    protected $casts = [
        'data' => 'array'
    ];

    public function student()
    {
        return $this->belongsTo(StudentInformation::class, 'student_information_id');
    }
}
