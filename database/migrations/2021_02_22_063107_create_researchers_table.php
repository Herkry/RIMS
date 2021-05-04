<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResearchersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Schema::create('researchers', function (Blueprint $table) {
        //   $table->id();
        //    $table->timestamps();
        //});
		
		Schema::create('researchers', function (Blueprint $table) {
            $table->increments("res_id");
			$table->integer("res_staff_id")->unsigned();
			$table->timestamps();
			
        });
		
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('researchers');
    }
}
