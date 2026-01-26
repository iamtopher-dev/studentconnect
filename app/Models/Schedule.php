<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
   protected $table = "schedule";
    protected $guarded = ["schedule_id"];
    protected $fillable = [
        "pdf_file",
        "schedule_for",
    ];
}
