<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('members', function (Blueprint $table) {
            $table->increments("mem_id");
            $table->string("mem_fname");
            $table->string("mem_lname");
            $table->string("mem_uname");
            $table->string("ORCID_ID");
            $table->string("mem_dpt");
            $table->string("mem_pass");            
            $table->string("mem_staff_email");
            $table->integer("mem_staff_id")->unsigned();
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
        Schema::dropIfExists('members');
    }
}
