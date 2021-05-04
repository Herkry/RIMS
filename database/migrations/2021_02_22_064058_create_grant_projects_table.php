<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGrantProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Schema::create('grant_projects', function (Blueprint $table) {
        //    $table->id();
        //    $table->timestamps();
        //});
		Schema::create('grant_projects', function (Blueprint $table) {
			$table->increments("grant_id");
			$table->timestamps();
			
			$table->integer("bid_id")->unsigned();
			$table->foreign("bid_id")->references("bid_id")->on("bids");
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grant_projects');
    }
}
