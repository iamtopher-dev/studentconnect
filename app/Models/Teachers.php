<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teachers extends Model
{
    protected $table = "teachers";
    protected $guarded = ["teacher_id"];
    protected $fillable = [
        "name",
    ];
}
