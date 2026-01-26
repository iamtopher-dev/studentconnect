<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentInformation extends Model
{
    protected $table = "student_information";
    protected $primaryKey = 'student_information_id';
    protected $fillable = [
        "family_name",
        "first_name",
        "middle_name",
        "major",
        "year_level",
        "dob",
        "place_of_birth",
        "street",
        "barangay",
        "nationality",
        "province",
        "sex",
        "civil_status",
        "religion",
        "email",
        "municipality",
        "guardian_name",
        "guardian_contact_number",
        "section",
        "semester",
        "isAccept",
        "applicant_type",
        "school_year",
    ];
    public function user()
{
    return $this->hasOne(User::class, 'student_information_id', 'student_information_id');
}
}
