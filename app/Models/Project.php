<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $primaryKey = 'proj_id';
    protected $fillable = [ "proj_id", "proj_type", "created_at", "updated_at", "res_id", "proj_funder", "proj_description", "project_start_date", "project_end_date", "created_by", "status_progress", "proj_name" ];
}
