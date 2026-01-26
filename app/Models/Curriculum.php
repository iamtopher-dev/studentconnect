<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    protected $table = "curriculum";
    protected $guarded = ["id"];
    protected $fillable = [
        "subject_name",
        "curriculum_for",
        "year",
        "semester",
        "code",
        "units",
        "course",
    ];
}
