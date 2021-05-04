<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMemberForeignKeyToUsersTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::table('users_tables', function (Blueprint $table) {
            
        // });

        Schema::table('researchers', function (Blueprint $table) {
            // add foreign key mem_id
            $table->integer("mem_id")->unsigned();
            $table->foreign("mem_id")->references("mem_id")->on("members");
            
        });

        Schema::table('group_admins', function (Blueprint $table) {
            // add foreign key mem_id
            $table->integer("mem_id")->unsigned();
            $table->foreign("mem_id")->references("mem_id")->on("members");
            
        });

        Schema::table('super_admins', function (Blueprint $table) {
            // add foreign key mem_id
            $table->integer("mem_id")->unsigned();
            $table->foreign("mem_id")->references("mem_id")->on("members");
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users_tables', function (Blueprint $table) {
            //
        });
    }
}
