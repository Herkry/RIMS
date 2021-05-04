<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectIncident;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


class ProjectIncidentController extends Controller
{

    public function addFileToProject(Request $request){
        
        // validation to be done frontend

        // add file to project
    	$project_incident = new ProjectIncident();
        $project_incident->p_inc_type = "file";

        // dealing with file- at the moment storing in an s3 bucket I had created in a past project, 
        // in the future change to new bucket
        $path = request('file')->store('files', 's3');
        $project_incident->p_inc_file_ui_name = request("p_inc_file_ui_name");
        $project_incident->p_inc_file_actual_name = basename($path);
        $project_incident->p_inc_file_url = Storage::disk('s3')->url($path);
        
        $project_incident->proj_id = request("proj_id");
        $project_incident->save();
        
        return $request->file;
    }

    public function removeFileFromProject(Request $request){
        // remove file from project
        DB::delete("delete from project_incident where p_inc_id = ?", [request("p_inc_id")]);
    }
    
}
