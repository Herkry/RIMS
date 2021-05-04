<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectCollaboratorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_collaborators', function (Blueprint $table) {
            $table->increments("p_collabo_id");
            $table->string("p_collabo_type");
            $table->string("p_collabo_role");

            $table->string("p_collabo_orcid_id");
            
            $table->timestamps();
            
            $table->integer("proj_id")->unsigned();
            $table->foreign("proj_id")->references("proj_id")->on("projects");
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_collaborators');
    }
}
