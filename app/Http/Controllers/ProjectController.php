<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;
use App\Models\Project;

use App\Models\Bid;
use App\Models\DonorProject;
use App\Models\GrantProject;
use App\Models\Uproject;
use App\Models\ProjectIncident;
use App\Models\ProjectCollaborator;
use App\Models\BidCollaborator;

class ProjectController extends Controller
{
    public function getOngoingProjects(Request $request, $mem_id){
        $allOngoingProjectsF = array();
        $myOngoingProjectsF = array();
        $myOngoingProjectsCollaboratorsF = array();
        $otherOngoingProjectsF = array();
        $otherOngoingProjectsCollaboratorsF = array();

        // My Ongoing Projects
    	// get projects(in which I'm the team lead) that are ongoing
        $myOngoingProjects = DB::table("projects")->where("status_progress","=","ongoing")
                                                  ->where("mem_id","=","$mem_id")
                                                  ->get();
        // put these in my array
        $i = 0;                                          
        foreach($myOngoingProjects as $myOngoingProject){
            $myOngoingProjectsF[$i]["proj_id"] = $myOngoingProject->proj_id;
            $myOngoingProjectsF[$i]["proj_type"] = $myOngoingProject->proj_type;
            $myOngoingProjectsF[$i]["created_at"] = $myOngoingProject->created_at;
            $myOngoingProjectsF[$i]["updated_at"] = $myOngoingProject->updated_at;
            $myOngoingProjectsF[$i]["proj_funder"] = $myOngoingProject->proj_funder;
            $myOngoingProjectsF[$i]["proj_description"] = $myOngoingProject->proj_description;
            $myOngoingProjectsF[$i]["project_start_date"] = $myOngoingProject->project_start_date;
            $myOngoingProjectsF[$i]["project_end_date"] = $myOngoingProject->project_end_date;
            $myOngoingProjectsF[$i]["created_by"] = $myOngoingProject->created_by;
            $myOngoingProjectsF[$i]["status_progress"] = $myOngoingProject->status_progress;
            $myOngoingProjectsF[$i]["proj_name"] = $myOngoingProject->proj_name;
            $myOngoingProjectsF[$i]["proj_funding_amt"] = $myOngoingProject->proj_funding_amt;
            $myOngoingProjectsF[$i]["proj_funding_currency"] = $myOngoingProject->proj_funding_currency;
            $myOngoingProjectsF[$i]["mem_id"] = $myOngoingProject->mem_id;
            $i++;
        }

        // Files- will deal with these later                                        
        // get project incidents belonging to each project
        // foreach($ongoingProjects as $ongoingProject){

        //     $matchingProjectsIncidents = DB::table("project_incidents")->where("proj_id","=","$ongoingProject->proj_id")->get();
        //     $ongoingProject->proj_incidents = $matchingProjectsIncidents;

        // }

        // get project collaborators belonging to each project(in which I'm the team lead)
        for($z = 0; $z < count($myOngoingProjectsF); $z++){
            $matchingProjectsCollaborators = DB::table("project_collaborators")->where("proj_id","=",$myOngoingProjectsF[$z]['proj_id'])->get();

            $j = 0;
            foreach($matchingProjectsCollaborators as $matchingProjectsCollaborator){
                // add collaborator to my array now
                $myOngoingProjectsCollaboratorsF[$j]["p_collabo_id"] = $matchingProjectsCollaborator->p_collabo_id;
                $myOngoingProjectsCollaboratorsF[$j]["p_collabo_type"] = $matchingProjectsCollaborator->p_collabo_type;
                $myOngoingProjectsCollaboratorsF[$j]["p_collabo_role"] = $matchingProjectsCollaborator->p_collabo_role;
                $myOngoingProjectsCollaboratorsF[$j]["created_at"] = $matchingProjectsCollaborator->created_at;
                $myOngoingProjectsCollaboratorsF[$j]["updated_at"] = $matchingProjectsCollaborator->updated_at;
                $myOngoingProjectsCollaboratorsF[$j]["proj_id"] = $matchingProjectsCollaborator->proj_id;
                $myOngoingProjectsCollaboratorsF[$j]["p_collabo_orcid_id"] = $matchingProjectsCollaborator->p_collabo_orcid_id;
                $myOngoingProjectsCollaboratorsF[$j]["mem_id"] = $matchingProjectsCollaborator->mem_id;

                // selecting name of collaborator from members table
                $members = DB::table("members")->where("mem_id", "=", $matchingProjectsCollaborator->mem_id)
                                               ->get()
                                               ->toArray();
                foreach($members as $member){
                    $collaborator_mem_fname = $member->mem_fname;
                    $collaborator_mem_lname = $member->mem_lname;
                }
                // selecting name of collaborator from members table

                $myOngoingProjectsCollaboratorsF[$j]["mem_fname"] = $collaborator_mem_fname;
                $myOngoingProjectsCollaboratorsF[$j]["mem_lname"] = $collaborator_mem_lname;
                $j++;
            }

            // add collaborators to myOngoingProjectsF
            $myOngoingProjectsF[$z]["proj_collaborators"] = $myOngoingProjectsCollaboratorsF;
        }

        // Other Ongoing Projects in which I am a collaborator
        // get other projectscollaborators records(in which I'm just a collaborator)
        $otherOngoingProjectsCollaborators= DB::table("project_collaborators")->where("mem_id","=",$mem_id)
                                                                              ->where("p_collabo_role","=","team_member")
                                                                              ->get();
        foreach($otherOngoingProjectsCollaborators as $otherOngoingProjectsCollaborator){
            // get other projects records(in which I'm just a collaborator)
            $otherOngoingProjects = DB::table("projects")->where("proj_id","=",$otherOngoingProjectsCollaborator->proj_id)
                                                         ->where("status_progress","=","ongoing")
                                                         ->get();

            // put these in my array
            $k = 0;                                          
            foreach($otherOngoingProjects as $otherOngoingProject){
                $otherOngoingProjectsF[$k]["proj_id"] = $otherOngoingProject->proj_id;
                $otherOngoingProjectsF[$k]["proj_type"] = $otherOngoingProject->proj_type;
                $otherOngoingProjectsF[$k]["created_at"] = $otherOngoingProject->created_at;
                $otherOngoingProjectsF[$k]["updated_at"] = $otherOngoingProject->updated_at;
                $otherOngoingProjectsF[$k]["proj_funder"] = $otherOngoingProject->proj_funder;
                $otherOngoingProjectsF[$k]["proj_description"] = $otherOngoingProject->proj_description;
                $otherOngoingProjectsF[$k]["project_start_date"] = $otherOngoingProject->project_start_date;
                $otherOngoingProjectsF[$k]["project_end_date"] = $otherOngoingProject->project_end_date;
                $otherOngoingProjectsF[$k]["created_by"] = $otherOngoingProject->created_by;
                $otherOngoingProjectsF[$k]["status_progress"] = $otherOngoingProject->status_progress;
                $otherOngoingProjectsF[$k]["proj_name"] = $otherOngoingProject->proj_name;
                $otherOngoingProjectsF[$k]["proj_funding_amt"] = $otherOngoingProject->proj_funding_amt;
                $otherOngoingProjectsF[$k]["proj_funding_currency"] = $otherOngoingProject->proj_funding_currency;
                $otherOngoingProjectsF[$k]["mem_id"] = $otherOngoingProject->mem_id;
                $k++;
            }

            // get project collaborators belonging to each project(in which I'm the team lead)
            for($y = 0; $y < count($otherOngoingProjectsF); $y++){
                $matchingProjectsCollaborators = DB::table("project_collaborators")->where("proj_id","=",$otherOngoingProjectsF[$y]["proj_id"])->get();

                $l = 0;
                foreach($matchingProjectsCollaborators as $matchingProjectsCollaborator){
                    // add collaborator to my array now
                    $otherOngoingProjectsCollaboratorsF[$l]["p_collabo_id"] = $matchingProjectsCollaborator->p_collabo_id;
                    $otherOngoingProjectsCollaboratorsF[$l]["p_collabo_type"] = $matchingProjectsCollaborator->p_collabo_type;
                    $otherOngoingProjectsCollaboratorsF[$l]["p_collabo_role"] = $matchingProjectsCollaborator->p_collabo_role;
                    $otherOngoingProjectsCollaboratorsF[$l]["created_at"] = $matchingProjectsCollaborator->created_at;
                    $otherOngoingProjectsCollaboratorsF[$l]["updated_at"] = $matchingProjectsCollaborator->updated_at;
                    $otherOngoingProjectsCollaboratorsF[$l]["proj_id"] = $matchingProjectsCollaborator->proj_id;
                    $otherOngoingProjectsCollaboratorsF[$l]["p_collabo_orcid_id"] = $matchingProjectsCollaborator->p_collabo_orcid_id;
                    $otherOngoingProjectsCollaboratorsF[$l]["mem_id"] = $matchingProjectsCollaborator->mem_id;

                    // selecting name of collaborator from members table
                    $members = DB::table("members")->where("mem_id", "=", $matchingProjectsCollaborator->mem_id)
                                                         ->get()
                                                         ->toArray();
                    foreach($members as $member){
                        $collaborator_mem_fname = $member->mem_fname;
                        $collaborator_mem_lname = $member->mem_lname;
                    }
                    // selecting name of collaborator from members table

                    $otherOngoingProjectsCollaboratorsF[$l]["mem_fname"] = $collaborator_mem_fname;
                    $otherOngoingProjectsCollaboratorsF[$l]["mem_lname"] = $collaborator_mem_lname;
                    $l++;
                }

                // add collaborators to myOngoingProjectsF
                $otherOngoingProjectsF[$y]["proj_collaborators"] = $otherOngoingProjectsCollaboratorsF;
            }


        }
        $allOngoingProjectsF = array_merge($myOngoingProjectsF, $otherOngoingProjectsF);


        return $allOngoingProjectsF;

    }

    public function getOngoingGrantsCount($mem_id){

        // get projects that are ongoing
        $ongoingGrants = DB::table("projects")->where("status_progress","=","ongoing")
                                              ->where("proj_type","=","grant")
                                              ->where("mem_id","=",$mem_id)
                                              ->get()
                                              ->toArray();

        $ongoingGrantsCount = count($ongoingGrants);
        $returnArray = array($ongoingGrantsCount);
        return json_encode($returnArray);
    }

    // get completed projects
    public function getCompletedProjects(Request $request, $mem_id){
        $allCompletedProjectsF = array();
        $myCompletedProjectsF = array();
        $myCompletedProjectsCollaboratorsF = array();
        $otherCompletedProjectsF = array();
        $otherCompletedProjectsCollaboratorsF = array();

        // My Ongoing Projects
        // get projects(in which I'm the team lead) that are ongoing
        $myCompletedProjects = DB::table("projects")->where("status_progress","=","completed")
                                                  ->where("mem_id","=","$mem_id")
                                                  ->get();
        // put these in my array
        $i = 0;                                          
        foreach($myCompletedProjects as $myCompletedProject){
            $myCompletedProjectsF[$i]["proj_id"] = $myCompletedProject->proj_id;
            $myCompletedProjectsF[$i]["proj_type"] = $myCompletedProject->proj_type;
            $myCompletedProjectsF[$i]["created_at"] = $myCompletedProject->created_at;
            $myCompletedProjectsF[$i]["updated_at"] = $myCompletedProject->updated_at;
            $myCompletedProjectsF[$i]["proj_funder"] = $myCompletedProject->proj_funder;
            $myCompletedProjectsF[$i]["proj_description"] = $myCompletedProject->proj_description;
            $myCompletedProjectsF[$i]["project_start_date"] = $myCompletedProject->project_start_date;
            $myCompletedProjectsF[$i]["project_end_date"] = $myCompletedProject->project_end_date;
            $myCompletedProjectsF[$i]["created_by"] = $myCompletedProject->created_by;
            $myCompletedProjectsF[$i]["status_progress"] = $myCompletedProject->status_progress;
            $myCompletedProjectsF[$i]["proj_name"] = $myCompletedProject->proj_name;
            $myCompletedProjectsF[$i]["proj_funding_amt"] = $myCompletedProject->proj_funding_amt;
            $myCompletedProjectsF[$i]["proj_funding_currency"] = $myCompletedProject->proj_funding_currency;
            $myCompletedProjectsF[$i]["mem_id"] = $myCompletedProject->mem_id;
            $i++;
        }

        // Files- will deal with these later                                        
        // get project incidents belonging to each project
        // foreach($ongoingProjects as $ongoingProject){

        //     $matchingProjectsIncidents = DB::table("project_incidents")->where("proj_id","=","$ongoingProject->proj_id")->get();
        //     $ongoingProject->proj_incidents = $matchingProjectsIncidents;

        // }

        // get project collaborators belonging to each project(in which I'm the team lead)
        for($z = 0; $z < count($myCompletedProjectsF); $z++){
            $matchingProjectsCollaborators = DB::table("project_collaborators")->where("proj_id","=",$myCompletedProjectsF[$z]['proj_id'])->get();

            $j = 0;
            foreach($matchingProjectsCollaborators as $matchingProjectsCollaborator){
                // add collaborator to my array now
                $myCompletedProjectsCollaboratorsF[$j]["p_collabo_id"] = $matchingProjectsCollaborator->p_collabo_id;
                $myCompletedProjectsCollaboratorsF[$j]["p_collabo_type"] = $matchingProjectsCollaborator->p_collabo_type;
                $myCompletedProjectsCollaboratorsF[$j]["p_collabo_role"] = $matchingProjectsCollaborator->p_collabo_role;
                $myCompletedProjectsCollaboratorsF[$j]["created_at"] = $matchingProjectsCollaborator->created_at;
                $myCompletedProjectsCollaboratorsF[$j]["updated_at"] = $matchingProjectsCollaborator->updated_at;
                $myCompletedProjectsCollaboratorsF[$j]["proj_id"] = $matchingProjectsCollaborator->proj_id;
                $myCompletedProjectsCollaboratorsF[$j]["p_collabo_orcid_id"] = $matchingProjectsCollaborator->p_collabo_orcid_id;
                $myCompletedProjectsCollaboratorsF[$j]["mem_id"] = $matchingProjectsCollaborator->mem_id;

                // selecting name of collaborator from members table
                $members = DB::table("members")->where("mem_id", "=", $matchingProjectsCollaborator->mem_id)
                                                     ->get()
                                                     ->toArray();
                foreach($members as $member){
                    $collaborator_mem_fname = $member->mem_fname;
                    $collaborator_mem_lname = $member->mem_lname;
                }
                // selecting name of collaborator from members table

                $myCompletedProjectsCollaboratorsF[$j]["mem_fname"] = $collaborator_mem_fname;
                $myCompletedProjectsCollaboratorsF[$j]["mem_lname"] = $collaborator_mem_lname;
                $j++;
            }

            // add collaborators to myCompletedProjectsF
            $myCompletedProjectsF[$z]["proj_collaborators"] = $myCompletedProjectsCollaboratorsF;
        }

        // Other Ongoing Projects in which I am a collaborator
        // get other projectscollaborators records(in which I'm just a collaborator)
        $otherCompletedProjectsCollaborators= DB::table("project_collaborators")->where("mem_id","=",$mem_id)
                                                                                ->where("p_collabo_role","=","team_member")
                                                                                ->get();
        foreach($otherCompletedProjectsCollaborators as $otherCompletedProjectsCollaborator){
            // get other projects records(in which I'm just a collaborator)
            $otherCompletedProjects = DB::table("projects")->where("proj_id","=",$otherCompletedProjectsCollaborator->proj_id)
                                                           ->where("status_progress","=","completed")
                                                           ->get();

            // put these in my array
            $k = 0;                                          
            foreach($otherCompletedProjects as $otherCompletedProject){
                $otherCompletedProjectsF[$k]["proj_id"] = $otherCompletedProject->proj_id;
                $otherCompletedProjectsF[$k]["proj_type"] = $otherCompletedProject->proj_type;
                $otherCompletedProjectsF[$k]["created_at"] = $otherCompletedProject->created_at;
                $otherCompletedProjectsF[$k]["updated_at"] = $otherCompletedProject->updated_at;
                $otherCompletedProjectsF[$k]["proj_funder"] = $otherCompletedProject->proj_funder;
                $otherCompletedProjectsF[$k]["proj_description"] = $otherCompletedProject->proj_description;
                $otherCompletedProjectsF[$k]["project_start_date"] = $otherCompletedProject->project_start_date;
                $otherCompletedProjectsF[$k]["project_end_date"] = $otherCompletedProject->project_end_date;
                $otherCompletedProjectsF[$k]["created_by"] = $otherCompletedProject->created_by;
                $otherCompletedProjectsF[$k]["status_progress"] = $otherCompletedProject->status_progress;
                $otherCompletedProjectsF[$k]["proj_name"] = $otherCompletedProject->proj_name;
                $otherCompletedProjectsF[$k]["proj_funding_amt"] = $otherCompletedProject->proj_funding_amt;
                $otherCompletedProjectsF[$k]["proj_funding_currency"] = $otherCompletedProject->proj_funding_currency;
                $otherCompletedProjectsF[$k]["mem_id"] = $otherCompletedProject->mem_id;
                $k++;
            }

            // get project collaborators belonging to each project(in which I'm the team lead)
            for($y = 0; $y < count($otherCompletedProjectsF); $y++){
                $matchingProjectsCollaborators = DB::table("project_collaborators")->where("proj_id","=",$otherCompletedProjectsF[$y]["proj_id"])->get();

                $l = 0;
                foreach($matchingProjectsCollaborators as $matchingProjectsCollaborator){
                    // add collaborator to my array now
                    $otherCompletedProjectsCollaboratorsF[$l]["p_collabo_id"] = $matchingProjectsCollaborator->p_collabo_id;
                    $otherCompletedProjectsCollaboratorsF[$l]["p_collabo_type"] = $matchingProjectsCollaborator->p_collabo_type;
                    $otherCompletedProjectsCollaboratorsF[$l]["p_collabo_role"] = $matchingProjectsCollaborator->p_collabo_role;
                    $otherCompletedProjectsCollaboratorsF[$l]["created_at"] = $matchingProjectsCollaborator->created_at;
                    $otherCompletedProjectsCollaboratorsF[$l]["updated_at"] = $matchingProjectsCollaborator->updated_at;
                    $otherCompletedProjectsCollaboratorsF[$l]["proj_id"] = $matchingProjectsCollaborator->proj_id;
                    $otherCompletedProjectsCollaboratorsF[$l]["p_collabo_orcid_id"] = $matchingProjectsCollaborator->p_collabo_orcid_id;
                    $otherCompletedProjectsCollaboratorsF[$l]["mem_id"] = $matchingProjectsCollaborator->mem_id;

                    // selecting name of collaborator from members table
                    $members = DB::table("members")->where("mem_id", "=", $matchingProjectsCollaborator->mem_id)
                                                         ->get()
                                                         ->toArray();
                    foreach($members as $member){
                        $collaborator_mem_fname = $member->mem_fname;
                        $collaborator_mem_lname = $member->mem_lname;
                    }
                    // selecting name of collaborator from members table

                    $otherCompletedProjectsCollaboratorsF[$l]["mem_fname"] = $collaborator_mem_fname;
                    $otherCompletedProjectsCollaboratorsF[$l]["mem_lname"] = $collaborator_mem_lname;
                    $l++;
                }

                // add collaborators to otherCompletedProjectsF
                $otherCompletedProjectsF[$y]["proj_collaborators"] = $otherCompletedProjectsCollaboratorsF;
            }


        }
        $allCompletedProjectsF = array_merge($myCompletedProjectsF, $otherCompletedProjectsF);


        return $allCompletedProjectsF;

    }

    // add project
    public function addProject(Request $request){
        // NB adding project(even if there's only one person doing a project, add them to the collaborators table-for easier selecting of projects when we need to retrieve them eg in getOngoingProjects() function)
        
        // validation to be done frontend

        // adding project info
        $project = new Project();
        $project->proj_type = request("proj_type");
        $project->proj_funder = request("proj_funder");
        $project->proj_description = request("proj_description");
        $project->project_start_date = request("project_start_date");
        $project->project_end_date = request("project_end_date");
        $project->status_progress = "ongoing";
        $project->created_by = "self";
        $project->proj_name = request("proj_name");
        $project->proj_funding_amt = request("proj_funding_amt");
        $project->proj_funding_currency = request("proj_funding_currency");
        $project->mem_id = request("mem_id");

        $project->save();

        // adding project collaborators
        $collaborators = request("proj_collaborators");

        // add team lead first
        $projectCollaboratorTeamLead = new ProjectCollaborator();
        $projectCollaboratorTeamLead->p_collabo_type = "internal";
        $projectCollaboratorTeamLead->p_collabo_role = "team_lead";
        $projectCollaboratorTeamLead->proj_id = $project->proj_id;
        $projectCollaboratorTeamLead->p_collabo_orcid_id = request("ORCID_ID");
        $projectCollaboratorTeamLead->mem_id = request("mem_id");

        $projectCollaboratorTeamLead->save();

        // add rest of collaborators
        foreach($collaborators as $collaborator){
            $projectCollaborator = new ProjectCollaborator();
            $projectCollaborator->p_collabo_type = $collaborator["collabo_type"];
            $projectCollaborator->p_collabo_role = $collaborator["collabo_role"];
            $projectCollaborator->proj_id = $project->proj_id;
            $projectCollaborator->p_collabo_orcid_id = $collaborator["collabo_orcid_id"];

            // get proj_collaborator mem_id using orcid_id, later I will add functionality for verifying orcid id before checking for other info using it
            $proj_collaborators = DB::table("members")->where("ORCID_ID", "=", $collaborator["collabo_orcid_id"])
                                                 ->get()
                                                 ->toArray();
            $proj_collaborator_mem_id = "";
            foreach($proj_collaborators as $proj_collaborator){
                $proj_collaborator_mem_id = $proj_collaborator->mem_id;
            }
            $projectCollaborator->mem_id = $proj_collaborator_mem_id;

            $projectCollaborator->save();
        } 
    }

    // delete project
    public function removeProject(Request $request, $proj_id){
        // update status_progress to deleted
        DB::update("update projects set status_progress = ? where proj_id = ?", ["deleted", $proj_id]); 
    }

    // edit project
    public function editProject(Request $request, $proj_id){
        
        // validation to be done frontend

        // get project info whose data we want to update
        $project = Project::where("proj_id", $proj_id)->first();
        $project->proj_type = request("proj_type");
        $project->proj_funder = request("proj_funder");
        $project->proj_description = request("proj_description");
        $project->project_start_date = request("project_start_date");
        $project->project_end_date = request("project_end_date");
        // not normally updated by user
        // $project->status_progress = "ongoing";
        // $project->created_by = "self";
        $project->proj_name = request("proj_name");
        $project->proj_funding_amt = request("proj_funding_amt");
        $project->proj_funding_currency = request("proj_funding_currency");
        $project->mem_id = request("mem_id");

        $project->save();

        // delete previous collaborators, replace with the ones from the frontend
        DB::delete("delete from project_collaborators where proj_id = ?", [$proj_id]);

        // adding project collaborators anew
        $collaborators = request("proj_collaborators");

        // add team lead first
        $projectCollaboratorTeamLead = new ProjectCollaborator();
        $projectCollaboratorTeamLead->p_collabo_type = "internal";
        $projectCollaboratorTeamLead->p_collabo_role = "team_lead";
        $projectCollaboratorTeamLead->proj_id = $project->proj_id;
        $projectCollaboratorTeamLead->p_collabo_orcid_id = request("ORCID_ID");
        $projectCollaboratorTeamLead->mem_id = request("mem_id");

        $projectCollaboratorTeamLead->save();

        // add rest of collaborators
        $r = 0;
        foreach($collaborators as $collaborator){

            $projectCollaborator = new ProjectCollaborator();
            $projectCollaborator->p_collabo_type = $collaborator["collabo_type"];
            $projectCollaborator->p_collabo_role = $collaborator["collabo_role"];
            $projectCollaborator->proj_id = $project->proj_id;
            $projectCollaborator->p_collabo_orcid_id = $collaborator["collabo_orcid_id"];

            // get proj_collaborator mem_id using orcid_id, later I will add functionality for verifying orcid id before checking for other info using it
            $proj_collaborators = DB::table("members")->where("ORCID_ID", "=", $collaborator["collabo_orcid_id"])
                                                 ->get()
                                                 ->toArray();
            $proj_collaborator_mem_id = "";
            foreach($proj_collaborators as $proj_collaborator){
                $proj_collaborator_mem_id = $proj_collaborator->mem_id;
            }
            $projectCollaborator->mem_id = $proj_collaborator_mem_id;

            $projectCollaborator->save();
            $r++;
        }
    }
    public function completeProject(Request $request, $proj_id){
        // update status_progress to completed
        DB::update("update projects set status_progress = ? where proj_id = ?", ["completed", $proj_id]);    
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Get ongoing proposals
    public function getOngoingProposals($mem_id){
        $allOngoingProposalsF = array();
        $myOngoingProposalsF = array();
        $myOngoingProposalsCollaboratorsF = array();
        $otherOngoingProposalsF = array();
        $otherOngoingProposalsCollaboratorsF = array();

        // My Ongoing Proposals
        // get proposal(in which I'm the team lead) that are ongoing
        $myOngoingProposals = DB::table("bids")->where("status_progress","=","ongoing")
                                               ->where("mem_id","=","$mem_id")
                                               ->get();
        // put these in my array
        $i = 0;                                          
        foreach($myOngoingProposals as $myOngoingProposal){
            $myOngoingProposalsF[$i]["bid_id"] = $myOngoingProposal->bid_id;
            $myOngoingProposalsF[$i]["bid_type"] = $myOngoingProposal->bid_type;
            $myOngoingProposalsF[$i]["created_at"] = $myOngoingProposal->created_at;
            $myOngoingProposalsF[$i]["updated_at"] = $myOngoingProposal->updated_at;
            $myOngoingProposalsF[$i]["status_progress"] = $myOngoingProposal->status_progress;
            $myOngoingProposalsF[$i]["mem_id"] = $myOngoingProposal->mem_id;
            $myOngoingProposalsF[$i]["bid_name"] = $myOngoingProposal->bid_name;
            $myOngoingProposalsF[$i]["bid_description"] = $myOngoingProposal->bid_description;
            $myOngoingProposalsF[$i]["bid_submission_date"] = $myOngoingProposal->bid_submission_date;
            $myOngoingProposalsF[$i]["bid_funder"] = $myOngoingProposal->bid_funder;
            $i++;
        }

        // Files- will deal with these later                                        
        // get project incidents belonging to each project
        // foreach($ongoingProjects as $ongoingProject){

        //     $matchingProjectsIncidents = DB::table("project_incidents")->where("proj_id","=","$ongoingProject->proj_id")->get();
        //     $ongoingProject->proj_incidents = $matchingProjectsIncidents;

        // }

        // get proposal collaborators belonging to each proposal(in which I'm the team lead)
        for($z = 0; $z < count($myOngoingProposalsF); $z++){
            $matchingProposalsCollaborators = DB::table("bid_collaborators")->where("bid_id","=",$myOngoingProposalsF[$z]['bid_id'])->get();

            $j = 0;
            foreach($matchingProposalsCollaborators as $matchingProposalsCollaborator){
                // add collaborator to my array now
                $myOngoingProposalsCollaboratorsF[$j]["bid_collabo_id"] = $matchingProposalsCollaborator->bid_collabo_id;
                $myOngoingProposalsCollaboratorsF[$j]["bid_collabo_type"] = $matchingProposalsCollaborator->bid_collabo_type;
                $myOngoingProposalsCollaboratorsF[$j]["bid_collabo_role"] = $matchingProposalsCollaborator->bid_collabo_role;
                $myOngoingProposalsCollaboratorsF[$j]["created_at"] = $matchingProposalsCollaborator->created_at;
                $myOngoingProposalsCollaboratorsF[$j]["updated_at"] = $matchingProposalsCollaborator->updated_at;
                $myOngoingProposalsCollaboratorsF[$j]["bid_id"] = $matchingProposalsCollaborator->bid_id;
                $myOngoingProposalsCollaboratorsF[$j]["bid_collabo_orcid_id"] = $matchingProposalsCollaborator->bid_collabo_orcid_id;
                $myOngoingProposalsCollaboratorsF[$j]["mem_id"] = $matchingProposalsCollaborator->mem_id;

                // selecting name of collaborator from members table
                $members = DB::table("members")->where("mem_id", "=", $matchingProposalsCollaborator->mem_id)
                                               ->get()
                                               ->toArray();
                foreach($members as $member){
                    $collaborator_mem_fname = $member->mem_fname;
                    $collaborator_mem_lname = $member->mem_lname;
                }
                // selecting name of collaborator from members table

                $myOngoingProposalsCollaboratorsF[$j]["mem_fname"] = $collaborator_mem_fname;
                $myOngoingProposalsCollaboratorsF[$j]["mem_lname"] = $collaborator_mem_lname;
                $j++;
            }

            // add collaborators to myOngoingProposalsF
            $myOngoingProposalsF[$z]["bid_collaborators"] = $myOngoingProposalsCollaboratorsF;
        }

        // Other Ongoing Proposals in which I am a collaborator
        // get other proposal collaborators records(in which I'm just a collaborator)
        $otherOngoingProposalsCollaborators= DB::table("bid_collaborators")->where("mem_id","=",$mem_id)
                                                                           ->where("bid_collabo_role","=","team_member")
                                                                           ->get();
        foreach($otherOngoingProposalsCollaborators as $otherOngoingProposalsCollaborator){
            // get other proposals records(in which I'm just a collaborator)
            $otherOngoingProposals = DB::table("bids")->where("bid_id","=",$otherOngoingProposalsCollaborator->bid_id)
                                                      ->where("status_progress","=","ongoing")
                                                      ->get();

            // put these in my array
            $k = 0;                                          
            foreach($otherOngoingProposals as $otherOngoingProposal){
                $otherOngoingProposalsF[$k]["bid_id"] = $otherOngoingProposal->bid_id;
                $otherOngoingProposalsF[$k]["bid_type"] = $otherOngoingProposal->bid_type;
                $otherOngoingProposalsF[$k]["created_at"] = $otherOngoingProposal->created_at;
                $otherOngoingProposalsF[$k]["updated_at"] = $otherOngoingProposal->updated_at;
                $otherOngoingProposalsF[$k]["status_progress"] = $otherOngoingProposal->status_progress;
                $otherOngoingProposalsF[$k]["mem_id"] = $otherOngoingProposal->mem_id;
                $otherOngoingProposalsF[$k]["bid_name"] = $otherOngoingProposal->bid_name;
                $otherOngoingProposalsF[$k]["bid_description"] = $otherOngoingProposal->bid_description;
                $otherOngoingProposalsF[$k]["bid_submission_date"] = $otherOngoingProposal->bid_submission_date;
                $otherOngoingProposalsF[$k]["bid_funder"] = $otherOngoingProposal->bid_funder;

                $k++;
            }

            // get proposal collaborators belonging to each proposal(in which I'm the team lead)
            for($y = 0; $y < count($otherOngoingProposalsF); $y++){
                $matchingProposalsCollaborators = DB::table("bid_collaborators")->where("bid_id","=",$otherOngoingProposalsF[$y]["bid_id"])->get();

                $l = 0;
                foreach($matchingProposalsCollaborators as $matchingProposalsCollaborator){
                    // add collaborator to my array now
                    $otherOngoingProposalsCollaboratorsF[$l]["bid_collabo_id"] = $matchingProposalsCollaborator->bid_collabo_id;
                    $otherOngoingProposalsCollaboratorsF[$l]["bid_collabo_type"] = $matchingProposalsCollaborator->bid_collabo_type;
                    $otherOngoingProposalsCollaboratorsF[$l]["bid_collabo_role"] = $matchingProposalsCollaborator->bid_collabo_role;
                    $otherOngoingProposalsCollaboratorsF[$l]["created_at"] = $matchingProposalsCollaborator->created_at;
                    $otherOngoingProposalsCollaboratorsF[$l]["updated_at"] = $matchingProposalsCollaborator->updated_at;
                    $otherOngoingProposalsCollaboratorsF[$l]["bid_id"] = $matchingProposalsCollaborator->bid_id;
                    $otherOngoingProposalsCollaboratorsF[$l]["bid_collabo_orcid_id"] = $matchingProposalsCollaborator->bid_collabo_orcid_id;
                    $otherOngoingProposalsCollaboratorsF[$l]["mem_id"] = $matchingProposalsCollaborator->mem_id;

                    // selecting name of collaborator from members table
                    $members = DB::table("members")->where("mem_id", "=", $matchingProposalsCollaborator->mem_id)
                                                   ->get()
                                                   ->toArray();
                    foreach($members as $member){
                        $collaborator_mem_fname = $member->mem_fname;
                        $collaborator_mem_lname = $member->mem_lname;
                    }
                    // selecting name of collaborator from members table

                    $otherOngoingProposalsCollaboratorsF[$l]["mem_fname"] = $collaborator_mem_fname;
                    $otherOngoingProposalsCollaboratorsF[$l]["mem_lname"] = $collaborator_mem_lname;
                    $l++;
                }

                // add collaborators to myOngoingProposalsF
                $otherOngoingProposalsF[$y]["bid_collaborators"] = $otherOngoingProposalsCollaboratorsF;
            }


        }
        $allOngoingProposalsF = array_merge($myOngoingProposalsF, $otherOngoingProposalsF);

        return $allOngoingProposalsF;
    }

     public function getOngoingProposalsCount($mem_id){

        // get proposals that are ongoing
        $ongoingProposals = DB::table("bids")->where("status_progress","=","ongoing")
                                             ->where("mem_id","=",$mem_id)
                                             ->get()
                                             ->toArray();

        $ongoingProposalsCount = count($ongoingProposals);
        $returnArray = array($ongoingProposalsCount);
        return json_encode($returnArray);
    }

    // Get completed proposals
    public function getCompletedProposals($mem_id){
        $allCompletedProposalsF = array();
        $myCompletedProposalsF = array();
        $myCompletedProposalsCollaboratorsF = array();
        $otherCompletedProposalsF = array();
        $otherCompletedProposalsCollaboratorsF = array();

        // My Completed Proposals
        // get proposal(in which I'm the team lead) that are completed
        $myCompletedProposals = DB::table("bids")->where("status_progress","<>","ongoing")
                                                 ->where("status_progress","<>", "deleted")   
                                                 ->where("mem_id","=","$mem_id")
                                                 ->get();
        // put these in my array
        $i = 0;                                          
        foreach($myCompletedProposals as $myCompletedProposal){
            $myCompletedProposalsF[$i]["bid_id"] = $myCompletedProposal->bid_id;
            $myCompletedProposalsF[$i]["bid_type"] = $myCompletedProposal->bid_type;
            $myCompletedProposalsF[$i]["created_at"] = $myCompletedProposal->created_at;
            $myCompletedProposalsF[$i]["updated_at"] = $myCompletedProposal->updated_at;
            $myCompletedProposalsF[$i]["status_progress"] = $myCompletedProposal->status_progress;
            $myCompletedProposalsF[$i]["mem_id"] = $myCompletedProposal->mem_id;
            $myCompletedProposalsF[$i]["bid_name"] = $myCompletedProposal->bid_name;
            $myCompletedProposalsF[$i]["bid_description"] = $myCompletedProposal->bid_description;
            $myCompletedProposalsF[$i]["bid_submission_date"] = $myCompletedProposal->bid_submission_date;
            $myCompletedProposalsF[$i]["bid_funder"] = $myCompletedProposal->bid_funder;
            $i++;
        }

        // Files- will deal with these later                                        
        // get project incidents belonging to each project
        // foreach($CompletedProjects as $CompletedProject){

        //     $matchingProjectsIncidents = DB::table("project_incidents")->where("proj_id","=","$CompletedProject->proj_id")->get();
        //     $CompletedProject->proj_incidents = $matchingProjectsIncidents;

        // }

        // get proposal collaborators belonging to each proposal(in which I'm the team lead)
        for($z = 0; $z < count($myCompletedProposalsF); $z++){
            $matchingProposalsCollaborators = DB::table("bid_collaborators")->where("bid_id","=",$myCompletedProposalsF[$z]['bid_id'])->get();

            $j = 0;
            foreach($matchingProposalsCollaborators as $matchingProposalsCollaborator){
                // add collaborator to my array now
                $myCompletedProposalsCollaboratorsF[$j]["bid_collabo_id"] = $matchingProposalsCollaborator->bid_collabo_id;
                $myCompletedProposalsCollaboratorsF[$j]["bid_collabo_type"] = $matchingProposalsCollaborator->bid_collabo_type;
                $myCompletedProposalsCollaboratorsF[$j]["bid_collabo_role"] = $matchingProposalsCollaborator->bid_collabo_role;
                $myCompletedProposalsCollaboratorsF[$j]["created_at"] = $matchingProposalsCollaborator->created_at;
                $myCompletedProposalsCollaboratorsF[$j]["updated_at"] = $matchingProposalsCollaborator->updated_at;
                $myCompletedProposalsCollaboratorsF[$j]["bid_id"] = $matchingProposalsCollaborator->bid_id;
                $myCompletedProposalsCollaboratorsF[$j]["bid_collabo_orcid_id"] = $matchingProposalsCollaborator->bid_collabo_orcid_id;
                $myCompletedProposalsCollaboratorsF[$j]["mem_id"] = $matchingProposalsCollaborator->mem_id;

                // selecting name of collaborator from members table
                $members = DB::table("members")->where("mem_id", "=", $matchingProposalsCollaborator->mem_id)
                                               ->get()
                                               ->toArray();
                foreach($members as $member){
                    $collaborator_mem_fname = $member->mem_fname;
                    $collaborator_mem_lname = $member->mem_lname;
                }
                // selecting name of collaborator from members table

                $myCompletedProposalsCollaboratorsF[$j]["mem_fname"] = $collaborator_mem_fname;
                $myCompletedProposalsCollaboratorsF[$j]["mem_lname"] = $collaborator_mem_lname;
                $j++;
            }

            // add collaborators to myCompletedProposalsF
            $myCompletedProposalsF[$z]["bid_collaborators"] = $myCompletedProposalsCollaboratorsF;
        }

        // Other Completed Proposals in which I am a collaborator
        // get other proposal collaborators records(in which I'm just a collaborator)
        $otherCompletedProposalsCollaborators= DB::table("bid_collaborators")->where("mem_id","=",$mem_id)
                                                                           ->where("bid_collabo_role","=","team_member")
                                                                           ->get();
        foreach($otherCompletedProposalsCollaborators as $otherCompletedProposalsCollaborator){
            // get other proposals records(in which I'm just a collaborator)
            $otherCompletedProposals = DB::table("bids")->where("bid_id","=",$otherCompletedProposalsCollaborator->bid_id)
                                                      ->where("status_progress","<>","ongoing")
                                                      ->where("status_progress","<>", "deleted")
                                                      ->get();

            // put these in my array
            $k = 0;                                          
            foreach($otherCompletedProposals as $otherCompletedProposal){
                $otherCompletedProposalsF[$k]["bid_id"] = $otherCompletedProposal->bid_id;
                $otherCompletedProposalsF[$k]["bid_type"] = $otherCompletedProposal->bid_type;
                $otherCompletedProposalsF[$k]["created_at"] = $otherCompletedProposal->created_at;
                $otherCompletedProposalsF[$k]["updated_at"] = $otherCompletedProposal->updated_at;
                $otherCompletedProposalsF[$k]["status_progress"] = $otherCompletedProposal->status_progress;
                $otherCompletedProposalsF[$k]["mem_id"] = $otherCompletedProposal->mem_id;
                $otherCompletedProposalsF[$k]["bid_name"] = $otherCompletedProposal->bid_name;
                $otherCompletedProposalsF[$k]["bid_description"] = $otherCompletedProposal->bid_description;
                $otherCompletedProposalsF[$k]["bid_submission_date"] = $otherCompletedProposal->bid_submission_date;
                $otherCompletedProposalsF[$k]["bid_funder"] = $otherCompletedProposal->bid_funder;

                $k++;
            }

            // get proposal collaborators belonging to each proposal(in which I'm the team lead)
            for($y = 0; $y < count($otherCompletedProposalsF); $y++){
                $matchingProposalsCollaborators = DB::table("bid_collaborators")->where("bid_id","=",$otherCompletedProposalsF[$y]["bid_id"])->get();

                $l = 0;
                foreach($matchingProposalsCollaborators as $matchingProposalsCollaborator){
                    // add collaborator to my array now
                    $otherCompletedProposalsCollaboratorsF[$l]["bid_collabo_id"] = $matchingProposalsCollaborator->bid_collabo_id;
                    $otherCompletedProposalsCollaboratorsF[$l]["bid_collabo_type"] = $matchingProposalsCollaborator->bid_collabo_type;
                    $otherCompletedProposalsCollaboratorsF[$l]["bid_collabo_role"] = $matchingProposalsCollaborator->bid_collabo_role;
                    $otherCompletedProposalsCollaboratorsF[$l]["created_at"] = $matchingProposalsCollaborator->created_at;
                    $otherCompletedProposalsCollaboratorsF[$l]["updated_at"] = $matchingProposalsCollaborator->updated_at;
                    $otherCompletedProposalsCollaboratorsF[$l]["bid_id"] = $matchingProposalsCollaborator->bid_id;
                    $otherCompletedProposalsCollaboratorsF[$l]["bid_collabo_orcid_id"] = $matchingProposalsCollaborator->bid_collabo_orcid_id;
                    $otherCompletedProposalsCollaboratorsF[$l]["mem_id"] = $matchingProposalsCollaborator->mem_id;

                    // selecting name of collaborator from members table
                    $members = DB::table("members")->where("mem_id", "=", $matchingProposalsCollaborator->mem_id)
                                                   ->get()
                                                   ->toArray();
                    foreach($members as $member){
                        $collaborator_mem_fname = $member->mem_fname;
                        $collaborator_mem_lname = $member->mem_lname;
                    }
                    // selecting name of collaborator from members table

                    $otherCompletedProposalsCollaboratorsF[$l]["mem_fname"] = $collaborator_mem_fname;
                    $otherCompletedProposalsCollaboratorsF[$l]["mem_lname"] = $collaborator_mem_lname;
                    $l++;
                }

                // add collaborators to myCompletedProposalsF
                $otherCompletedProposalsF[$y]["bid_collaborators"] = $otherCompletedProposalsCollaboratorsF;
            }


        }
        $allCompletedProposalsF = array_merge($myCompletedProposalsF, $otherCompletedProposalsF);


        return $allCompletedProposalsF;
    }

    public function addProposal(Request $request){
        // validation to be done frontend

        // adding proposal
        $bid = new Bid();
        $bid->bid_type = "proposal";
        $bid->status_progress = "ongoing";
        $bid->mem_id = $request->mem_id;

        $bid->bid_name = $request->bid_name;
        $bid->bid_description = $request->bid_description;
        $bid->bid_submission_date = $request->bid_submission_date;
        $bid->bid_funder = $request->bid_funder;
        // timestamps are updated automatically by Eloquent

        $bid->save();

        // add team lead first
        $collaboratorTeamLead = new BidCollaborator();
        $collaboratorTeamLead->bid_collabo_type = "internal";
        $collaboratorTeamLead->bid_collabo_role = "team_lead";
        $collaboratorTeamLead->bid_id = $bid->bid_id;
        $collaboratorTeamLead->bid_collabo_orcid_id = request("ORCID_ID");
        $collaboratorTeamLead->mem_id = request("mem_id");
        // timestamps updated automatically by Eloquent

        $collaboratorTeamLead->save();

        // adding proposal collaborators
        $collaborators = request("bid_collaborators");
        foreach($collaborators as $collaborator){

            $bidCollaborator = new BidCollaborator();
            $bidCollaborator->bid_collabo_type = $collaborator["collabo_type"];
            $bidCollaborator->bid_collabo_role = $collaborator["collabo_role"];
            $bidCollaborator->bid_id = $bid->bid_id;
            $bidCollaborator->bid_collabo_orcid_id = $collaborator["collabo_orcid_id"];

            // get bid_collaborator mem_id using orcid_id, later I will add functionality for verifying orcid id before checking for other info using it
            $bid_collaborators = DB::table("members")->where("ORCID_ID", "=", $collaborator["collabo_orcid_id"])
                                                     ->get()
                                                     ->toArray();
            $bid_collaborator_mem_id = "";
            foreach($bid_collaborators as $bid_collaborator){
                $bid_collaborator_mem_id = $bid_collaborator->mem_id;
            }
            $bidCollaborator->mem_id = $bid_collaborator_mem_id;

            $bidCollaborator->save();
        }

    }

    // delete proposal
    public function removeProposal(Request $request, $bid_id){
        // update status_progress to deleted
        DB::update("update bids set status_progress = ? where bid_id = ?", ["deleted", $bid_id]);
    }

    // edit proposal
    public function editProposal(Request $request, $bid_id){
        
        // validation to be done frontend

        // get proposal info whose data we want to update
        $bid = Bid::where("bid_id", $bid_id)->first();
        // unchanged
        // $bid->bid_type = request("bid_type");
        // $bid->mem_id = request("mem_id");
        $bid->bid_name = request("bid_name");
        $bid->bid_description = request("bid_description");
        $bid->bid_submission_date = request("bid_submission_date");
        // not normally updated by user
        // $bid->status_progress = "ongoing";
        $bid->bid_funder = request("bid_funder");

        $bid->save();

        // delete previous collaborators, replace with the ones from the frontend
        DB::delete("delete from bid_collaborators where bid_id = ?", [$bid_id]);

        // add team lead first
        $bidCollaboratorTeamLead = new BidCollaborator();
        $bidCollaboratorTeamLead->bid_collabo_type = "internal";
        $bidCollaboratorTeamLead->bid_collabo_role = "team_lead";
        $bidCollaboratorTeamLead->bid_id = $bid->bid_id;
        $bidCollaboratorTeamLead->bid_collabo_orcid_id = request("ORCID_ID");
        $bidCollaboratorTeamLead->mem_id = request("mem_id");
        $bidCollaboratorTeamLead->save();

        // adding bid collaborators anew
        $collaborators = request("bid_collaborators");

        // add rest of collaborators
        foreach($collaborators as $collaborator){

            $bidCollaborator = new BidCollaborator();
            $bidCollaborator->bid_collabo_type = $collaborator["collabo_type"];
            $bidCollaborator->bid_collabo_role = $collaborator["collabo_role"];
            $bidCollaborator->bid_id = $bid->bid_id;
            $bidCollaborator->bid_collabo_orcid_id = $collaborator["collabo_orcid_id"];

            // get bid_collaborator mem_id using orcid_id, later I will add functionality for verifying orcid id before checking for other info using it
            $bid_collaborators = DB::table("members")->where("ORCID_ID", "=", $collaborator["collabo_orcid_id"])
                                                     ->get()
                                                     ->toArray();
            $bid_collaborator_mem_id = "";
            foreach($bid_collaborators as $bid_collaborator){
                $bid_collaborator_mem_id = $bid_collaborator->mem_id;
            }

            $bidCollaborator->mem_id = $bid_collaborator_mem_id;
            $bidCollaborator->save();
        }
    }

    public function completeProposal(Request $request, $bid_id){
        // update status_progress of proposal to completed
        DB::update("update bids set status_progress = ? where bid_id = ?", ["completed", $bid_id]);

        // create new project in projects table
         // NB adding project(even if there's only one person doing a project, add them to the collaborators table-for easier selecting of projects when we need to retrieve them eg in getOngoingProjects() function)
        
        // validation to be done frontend

        // adding project info
        $bid = Bid::where("bid_id", $bid_id)->first();
        $project = new Project();
        $project->proj_type = "grant";
        $project->proj_funder = $bid->bid_funder;
        $project->proj_description = $bid->bid_description;
        $project->project_start_date = request("project_start_date");
        $project->project_end_date = request("project_end_date");
        $project->status_progress = "ongoing";
        $project->created_by = "self";
        $project->proj_name = $bid->bid_name;
        $project->proj_funding_amt = request("proj_funding_amt");
        $project->proj_funding_currency = request("proj_funding_currency");
        $project->mem_id = $bid->mem_id;

        $project->save();

        // get bid collaborators, make them project collaborators
        $bid_collaborators = DB::table("bid_collaborators")->where("bid_id", "=", $bid_id)
                                                               ->get();
        // making them project collaborators                                                                
        foreach($bid_collaborators as $bid_collaborator){
            $projectCollaborator = new ProjectCollaborator();
            $projectCollaborator->p_collabo_type = $bid_collaborator->bid_collabo_type;
            $projectCollaborator->p_collabo_role = $bid_collaborator->bid_collabo_role;
            $projectCollaborator->proj_id = $project->proj_id;
            $projectCollaborator->p_collabo_orcid_id = $bid_collaborator->bid_collabo_orcid_id;
            $projectCollaborator->mem_id = $bid_collaborator->mem_id;

            $projectCollaborator->save();
        }   
    }

    public function setRejectedProposal(Request $request, $bid_id){
        // update status_progress of proposal to rejectde
        DB::update("update bids set status_progress = ? where bid_id = ?", ["rejected", $bid_id]);
    }
}
