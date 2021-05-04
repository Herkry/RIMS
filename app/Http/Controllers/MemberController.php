<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Models\Member;
use App\Reseacher;
use App\GroupAdmin;
use App\FacultyAdmin;
use App\RegistrationRequest;

class MemberController extends Controller
{
    // register researcher - data sent to group admin who has to approve registration info so that a researcher account is created.
    public function registerResearcher(Request $request){
    	// validation to be done frontend

        $researcher = new Member();
        $researcher->mem_fname = request('mem_fname');
        $researcher->mem_lname = request('mem_lname');
        $researcher->mem_uname = request('mem_fname') . "." . request('mem_lname');
        $researcher->ORCID_ID = request('ORCID_ID');
        $researcher->mem_dpt = request('mem_dpt');
        $researcher->mem_pass = md5(request('mem_pass'));
        $researcher->mem_staff_email = request('mem_staff_email');
        $researcher->mem_staff_id = request('mem_staff_id');
        $researcher->mem_type = "researcher_only";
        $researcher->mem_research_group = "none";
        $researcher->status_approval = "pending_group_admin_approval";

        $researcher->save();

        $responseArray = array("error"=> "none", 
                               "message"=>"success",
                               "mem_id"=>$researcher->mem_id, 
                               "mem_staff_id"=> $researcher->mem_staff_id, 
                               "mem_fname"=> $researcher->mem_fname,
                               "mem_lname"=> $researcher->mem_lname,
                               "mem_type"=> $researcher->mem_type,
                               "ORCID_ID"=> $researcher->ORCID_ID 
                         );
        return json_encode($responseArray);
    }

    // to be registered as group admin one needs to have a regular account first(in other words to be a researcher first)
    // register faculty admin - data sent to super admin who has to approve registration info so that a group admin account is created
    public function registerGroupAdmin(Request $request){
        // validation to be done frontend

        // get mem_id using staff_no
        $groupAdminsDB = DB::table("members")->where("mem_staff_id", "=", request('mem_staff_id'))
                                             ->get()
                                             ->toArray();
        foreach($groupAdminsDB as $group_admin){
            $group_admin_mem_id = $group_admin->mem_id;
        }

        // following update statements not working for some reason had to use db query builder
        // $groupAdmin = Member::where("mem_id", $group_admin_mem_id);
        // $groupAdmin->mem_type = "researcher_n_group_admin";
        // $groupAdmin->status_approval = "pending_super_admin_approval";
        // $groupAdmin->save();

        DB::update("update members set mem_type = ?, status_approval = ? where mem_id = ?", ["researcher_n_group_admin", "pending_super_admin_approval", $group_admin_mem_id]);

    }

    public function loginUser(Request $request){
        // validation to be done frontend

        // verify if username exists
        $members = DB::table("members")->where("mem_staff_id", "=", $request->mem_staff_id)
                                       ->get()
                                       ->toArray();

        if(count($members) > 0){
            // verify password
            $db_pass = $members[0]->mem_pass;
            if (md5($request->mem_pass) == $db_pass){

                    // return success message and other important info to be stored in browser session 
                    $responseArray = array("error"=> "none", 
                                           "message"=>"success",
                                           "mem_id"=>$members[0]->mem_id, 
                                           "mem_staff_id"=> $members[0]->mem_staff_id, 
                                           "mem_fname"=> $members[0]->mem_fname,
                                           "mem_lname"=> $members[0]->mem_lname,
                                           "mem_type"=> $members[0]->mem_type,
                                           "ORCID_ID"=> $members[0]->ORCID_ID
                                     );


                    return json_encode($responseArray);
                }
                else{
                    // error wrong password
                    $responseArray = array("error"=> "Wrong Password", 
                                           "message"=>"error"
                                     );
                    return json_encode($responseArray);
                }
        }
        else{
            // error username does not exist
            $responseArray = array("error"=> "User does not exist", 
                                   "message"=>"error"
                             );
            return json_encode($responseArray);
        }
        //-------------------------------------------------------------------------------------------------------------------------//
        // obsolete code

        // if($request->mem_user_type == "super_admin"){
            
        //     //verify if username exists
        //     $super_admins = DB::table("members")->where("mem_staff_id", "=", $request->mem_staff_id)
        //     								    ->where("mem_type", "=", "super_admin")
        //     								    ->get()
        //     								    ->toArray();


        //     if(count($super_admins) > 0){
        //         //verify password
        //         $db_pass = $super_admins[0]->mem_pass;

        //         if (md5($request->mem_pass) == $db_pass){

        //         	// return success message and other important info to be stored in browser session 
        //         	$responseArray = array("error"=> "none", 
        //     							   "message"=>"success",
        //                                    "mem_id"=>$super_admins[0]->mem_id, 
        //         						   "mem_staff_id"=> $super_admins[0]->mem_staff_id, 
        //         						   "mem_lname"=> $super_admins[0]->mem_lname,
        //         						   "mem_type"=> $super_admins[0]->mem_type
        //         					 );


        //             return json_encode($responseArray);
        //         }
        //         else{
        //             // error wrong password
        //             $responseArray = array("error"=> "Wrong Password", 
			     //            			   "message"=>"error"
        //         					 );
        //             return json_encode($responseArray);
        //         }
        //     }
        //     else{
        //     	// error username does not exist
        //         $responseArray = array("error"=> "User does not exist", 
		      //           						 "message"=>"error"
        //     					 );
        //         return json_encode($responseArray);
        //     }
        // }
        // else if($request->mem_user_type == "group_admin"){
            
        //     //verify if username existss
        //     $group_admins = DB::table("members")->where("mem_staff_id", "=", $request->mem_staff_id)
        //     								    ->where("mem_type", "like", "%"."group_admin"."%")
        //                                         ->where("status_approval", "=", "approved")
        //     								    ->get()
        //     								    ->toArray();
        //     if(count($group_admins) > 0){
        //         //verify password
        //         $db_pass = $group_admins[0]->mem_pass;

        //         if (md5($request->mem_pass) == $db_pass){

        //         	// return success message and other important info to be stored in browser session
        //         	$responseArray = array("error"=> "none", 
        //                                   "message"=>"success",
        //                                   "mem_id"=>$group_admins[0]->mem_id, 
        //                                   "mem_staff_id"=> $group_admins[0]->mem_staff_id, 
        //                                   "mem_lname"=> $group_admins[0]->mem_lname,
        //                                   "mem_type"=> $group_admins[0]->mem_type
        //                              );

        //             return json_encode($responseArray);
        //         }
        //         else{
        //             // error wrong password
        //             $responseArray = array("error"=> "Wrong Password", 
			     //            							  "message"=>"error"
        //         					 );
        //             return json_encode($responseArray);
        //         }
        //     }
        //     else{
        //         	// error username does not exist
	       //          $responseArray = array("error"=> "User does not exist", 
			     //            				"message"=>"error"
	       //      					 );
	       //          return json_encode($responseArray);
        //         }

        // }

        // else if($request->mem_user_type == "researcher"){
            
        //     //verify if username exists
        //     $researchers = DB::table("members")->where("mem_staff_id", "=", $request->mem_staff_id)
        //                                        ->where("mem_type", "like", "%"."researcher"."%")
        //     								   ->where("status_approval", "=", "approved")
        //     								   ->get()
        //     								   ->toArray();
        //     if(count($researchers) > 0){
        //         //verify password
        //         $db_pass = $researchers[0]->mem_pass;

        //         if (md5($request->mem_pass) == $db_pass){

        //         	// return success message and other important info to be stored in browser session 
        //         	$responseArray = array("error"=> "none", 
        //                                   "message"=>"success",
        //                                   "mem_id"=>$researchers[0]->mem_id, 
        //                                   "mem_staff_id"=> $researchers[0]->mem_staff_id, 
        //                                   "mem_lname"=> $researchers[0]->mem_lname,
        //                                   "mem_type"=> $researchers[0]->mem_type 
        //                              );

        //             return json_encode($responseArray);
        //         }
        //         else{
        //             // error wrong password
        //             $responseArray = array("error"=> "Wrong Password", 
			     //            				"message"=>"error"
        //         					 );
        //             return json_encode($responseArray);
        //         }
        //     }
        //     else{
        //         	// error username does not exist
	       //          $responseArray = array("error"=> "User does not exist", 
			     //            						 "message"=>"error"
	       //      					 );
	       //          return json_encode($responseArray);
        //     }
        // }
        // else{
        //     // do nothing
        // } 
        //
        // obsolete code
        //-------------------------------------------------------------------------------------------------------------------------//
    }

    public function getProfileInfo($mem_id){
        // get member info whose data we want to return
        $members = DB::table("members")->where("mem_id","=","$mem_id")->get()->toJson();

        return $members;
    }

    public function updateProfileInfo(Request $request, $mem_id){
        // get member info whose data we want to update
        $member = Member::where("mem_id", $mem_id)->first();

        // update the info
        
        // Files- will deal with these later
        // $mem_profile_photo = $request->file("mem_profile_photo");
        // //generate original name
        // $mem_profile_photo_name = "profile_photo-".time().$mem_profile_photo->getClientOriginalExtension();
        // // save to folder
        // $path = $mem_profile_photo->storeAs("photos", $mem_profile_photo_name);

        // dd($path);

        $member->mem_fname = $request->mem_fname;
        $member->mem_lname = $request->mem_lname;
        $member->mem_uname = $request->mem_fname.".".$request->mem_lname;
        $member->ORCID_ID = $request->ORCID_ID;
        $member->mem_dpt = $request->mem_dpt;
        $member->mem_staff_email = $request->mem_staff_email;
        $member->mem_staff_id = $request->mem_staff_id;

        $member->save();

        // return test
        $responseArray = array("message1"=> $request->mem_dpt, 
                                            "message2"=>"Done2"
                         );
        return json_encode($responseArray);

    }

    // test
    public function test(Request $request){
        // test 1
    	// $responseArray = array("data"=> array("erro3r"=> "User does not exist", 
			  //               							  "message"=>"error")
	    //         					 );
    	// return json_encode($responseArray);

        // test 2
        // get projects that are ongoing
        // $ongoingProjects = DB::table("projects")->where("status_progress","=","ongoing")->get();


        // // get project incidents belonging to each project
        // foreach($ongoingProjects as $ongoingProject){

        //     $matchingProjectsIncidents = DB::table("project_incidents")->where("proj_id","=","$ongoingProject->proj_id")->get();
        //     $ongoingProject->proj_incidents = $matchingProjectsIncidents;

        // }

        // return $ongoingProjects->toJson();

        // test 3
        // get projects that are ongoing
        $ongoingProjects = DB::table("projects")->where("status_progress","=","ongoing")->get();


        // get project incidents belonging to each project
        foreach($ongoingProjects as $ongoingProject){

            $matchingProjectsIncidents = DB::table("project_incidents")->where("proj_id","=","$ongoingProject->proj_id")->get();
            $ongoingProject->proj_incidents = $matchingProjectsIncidents;

        }

        // get project collaborators belonging to each project
        foreach($ongoingProjects as $ongoingProject){

            $matchingProjectsCollaborators = DB::table("project_collaborators")->where("proj_id","=","$ongoingProject->proj_id")->get();
            $ongoingProject->proj_collaborators = $matchingProjectsCollaborators;

        }



        return $ongoingProjects->toJson();
    }
}
