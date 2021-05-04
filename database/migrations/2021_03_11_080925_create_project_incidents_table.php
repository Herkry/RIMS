<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectIncidentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('project_incidents', function (Blueprint $table) {
            $table->increments("p_inc_id");
            $table->string("p_inc_type");
            
            $table->string("p_inc_file_ui_name");
            $table->string("p_inc_file_actual_name");
            $table->string("p_inc_file_url");

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
        //
        Schema::dropIfExists('project_incidents');
    }
}
