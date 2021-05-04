<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Schema::create('group_admins', function (Blueprint $table) {
        //    $table->id();
        //    $table->timestamps();
        //});
		
		Schema::create('group_admins', function (Blueprint $table) {
            $table->increments("ga_id");
			$table->integer("ga_staff_id")->unsigned();
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
        Schema::dropIfExists('group_admins');
    }
}
