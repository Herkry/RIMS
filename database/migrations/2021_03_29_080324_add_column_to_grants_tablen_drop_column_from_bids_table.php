<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToGrantsTablenDropColumnFromBidsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bids', function (Blueprint $table) {
            //
            $table->integer("res_id")->unsigned();
            $table->foreign("res_id")->references("res_id")->on("researchers");
        });
        
        Schema::table('grant_projects', function (Blueprint $table) {
            //
            $table->integer("proj_id")->unsigned();
            $table->foreign("proj_id")->references("proj_id")->on("projects");
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bids', function (Blueprint $table) {
            //
            $table->dropColumn("proj_id");
        });
    }
}
