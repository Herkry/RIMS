<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddingNewColToCollabosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::table('project_collaborators', function (Blueprint $table) {
            //
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
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
        });
    }
}
