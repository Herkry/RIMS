<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

// App Routes

// researcher register
Route::post('researcher/register', 'App\Http\Controllers\MemberController@registerResearcher');

// group admin register
Route::post('group-admin/register', 'App\Http\Controllers\MemberController@registerGroupAdmin');

// user login
Route::post('user/login', 'App\Http\Controllers\MemberController@loginUser');

// get ongoing and completed projects
Route::get('{mem_id}/projects/ongoing', 'App\Http\Controllers\ProjectController@getOngoingProjects');
Route::get('{mem_id}/projects/completed', 'App\Http\Controllers\ProjectController@getCompletedProjects');

// add project
Route::post('researcher/project', 'App\Http\Controllers\ProjectController@addProject');

// delete project
Route::post('researcher/project/{proj_id}/delete', 'App\Http\Controllers\ProjectController@removeProject');

// edit project
Route::post('researcher/project/{proj_id}/edit', 'App\Http\Controllers\ProjectController@editProject');

// complete project
Route::post('researcher/project/{proj_id}/complete', 'App\Http\Controllers\ProjectController@completeProject');

// Files- will deal with these later
// // add file to specific project
// Route::post('researcher/project/file/add', 'App\Http\Controllers\ProjectIncidentController@addFileToProject');

// // delete file from specific project
// Route::post('researcher/project/file/remove', 'App\Http\Controllers\ProjectIncidentController@removeFileFromProject');

// get ongoing and completed proposals
Route::get('{mem_id}/proposals/ongoing','App\Http\Controllers\ProjectController@getOngoingProposals');
Route::get('{mem_id}/proposals/completed','App\Http\Controllers\ProjectController@getCompletedProposals');

// add proposal
Route::post('researcher/proposal', 'App\Http\Controllers\ProjectController@addProposal');

// delete proposal
Route::post('researcher/proposal/{bid_id}/delete', 'App\Http\Controllers\ProjectController@removeProposal');

// edit proposal
Route::post('researcher/proposal/{bid_id}/edit', 'App\Http\Controllers\ProjectController@editProposal');

// complete proposal
Route::post('researcher/proposal/{bid_id}/complete', 'App\Http\Controllers\ProjectController@completeProposal');

// rejected proposal
Route::post('researcher/proposal/{bid_id}/rejected', 'App\Http\Controllers\ProjectController@setRejectedProposal');

// get profile info
Route::get('user/{mem_id}/profile', 'App\Http\Controllers\MemberController@getProfileInfo');

// update profile info
Route::post('user/{mem_id}/profile/update', 'App\Http\Controllers\MemberController@updateProfileInfo');

// test route
Route::get('test/test', 'App\Http\Controllers\MemberController@test');
    