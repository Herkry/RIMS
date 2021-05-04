<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ReplaceResIdForeignKeysWithMemId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Projects-> drop res_id, replace with mem_id 
        Schema::table('projects', function (Blueprint $table) {
            //
            $table->dropForeign("projects_res_id_foreign");
            $table->dropColumn("res_id");
        });
        Schema::table('projects', function (Blueprint $table) {
            //
            $table->integer("mem_id")->unsigned();
            $table->foreign("mem_id")->references("mem_id")->on("members");
        });

        // Bids-> drop res_id, replace with mem_id 
        Schema::table('bids', function (Blueprint $table) {
            //
            //$table->dropForeign("bids_res_id_foreign");
            $table->dropColumn("res_id");
        });
        Schema::table('bids', function (Blueprint $table) {
            //
            $table->integer("mem_id")->unsigned();
            $table->foreign("mem_id")->references("mem_id")->on("members");
        });

        // Project_Collaborators-> drop res_id, replace with mem_id 
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
            //$table->dropForeign("project_collaborators_res_id_foreign");
            $table->dropColumn("res_id");
        });
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
            $table->integer("mem_id")->unsigned();
            $table->foreign("mem_id")->references("mem_id")->on("members");
        });

        // add mem_id and bid_collabo_orcid_id to bids
        Schema::table('bid_collaborators', function (Blueprint $table) {
            //
            $table->string("bid_collabo_orcid_id");

            $table->integer("mem_id")->unsigned();
            $table->foreign("mem_id")->references("mem_id")->on("members");

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
