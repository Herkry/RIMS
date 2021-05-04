<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Schema::create('events', function (Blueprint $table) {
        //    $table->id();
        //    $table->timestamps();
        //});
		
		Schema::create('events', function (Blueprint $table) {
            $table->increments("event_id");
			$table->string("event_type");
			$table->string("event_creator_type");
			$table->timestamps();
			
			// look for better way to define this foreign key to different tables
			// creator id can be res_id, fa_id or sa_id
			$table->integer("creator_id")->unsigned();
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
