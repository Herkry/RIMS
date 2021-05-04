<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJournalSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Schema::create('journal_submissions', function (Blueprint $table) {
        //    $table->id();
        //    $table->timestamps();
        //});
		
		Schema::create('journal_submissions', function (Blueprint $table) {
            $table->increments("js_id");
			$table->timestamps();
			
			$table->integer("work_id")->unsigned();
            $table->foreign("work_id")->references("work_id")->on("work_items");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('journal_submissions');
    }
}
