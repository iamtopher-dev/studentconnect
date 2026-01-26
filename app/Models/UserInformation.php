<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInformation extends Model
{

    protected $guarded = ['id'];
    protected $fillable = [
        "user_id",
        "first_name",
        "last_name",
        "middle_name",
        "applicant_type",
        "date_of_birth",
        "status",
        "gender",
        "place_of_birth",
        "nationality",
        "city_address",
        "tel_no",
        "provincial_address",
        "parent_or_guardian",
        "parent_occupation",
        "parent_address",
        "parent_tel_no",
        "student_job",
        "employer_address",
        "employer_tel_no",
        "scholarship",
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
