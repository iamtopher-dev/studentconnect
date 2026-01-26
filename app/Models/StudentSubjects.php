<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSubjects extends Model
{
    protected $table = "student_subjects";
    protected $primaryKey = 'student_subject_id';
    protected $fillable = [
        "user_id",
        "subject_name",
        "subject_code",
        "subject_units",
        "school_year",
        "semester",
        "year_level",
        "grades",
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'student_information_id', 'user_id');
    }
    
}
