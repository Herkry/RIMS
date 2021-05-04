<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Schema::create('work_items', function (Blueprint $table) {
        //    $table->id();
        //    $table->timestamps();
        //});
		
		Schema::create('work_items', function (Blueprint $table) {
            $table->increments("work_id");
			$table->string("work_type");
			$table->timestamps();
			
			$table->integer("res_id")->unsigned();
            $table->foreign("res_id")->references("res_id")->on("researchers");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('work_items');
    }
}
