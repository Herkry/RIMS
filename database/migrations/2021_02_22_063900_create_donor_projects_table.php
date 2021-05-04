<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDonorProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Schema::create('donor_projects', function (Blueprint $table) {
        //    $table->id();
        //    $table->timestamps();
        //});
		
		Schema::create('donor_projects', function (Blueprint $table) {
            $table->increments("dproj_id");
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
        Schema::dropIfExists('donor_projects');
    }
}
