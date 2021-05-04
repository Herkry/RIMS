<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToProjectCollaboratorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
            $table->string("p_collabo_orcid_id");

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
             $table->dropColumn("p_collabo_orcid_id");
        });
    }
}
