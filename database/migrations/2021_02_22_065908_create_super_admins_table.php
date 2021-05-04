<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuperAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		//Schema::create('super_admins', function (Blueprint $table) {
        //    $table->id();
        //    $table->timestamps();
        //});
		
		Schema::create('super_admins', function (Blueprint $table) {
            $table->increments("sa_id");
			$table->integer("sa_staff_id")->unsigned();
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
        Schema::dropIfExists('super_admins');
    }
}
