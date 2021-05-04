<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectIncident extends Model
{
    use HasFactory;
    protected $fillable = [ "p_inc_id", "p_inc_type", "p_inc_file_ui_name", "p_inc_file_actual_name", "p_inc_file_url", "created_at", "updated_at", "proj_id" ];
}
