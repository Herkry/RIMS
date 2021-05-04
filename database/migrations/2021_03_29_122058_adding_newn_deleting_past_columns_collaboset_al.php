<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddingNewnDeletingPastColumnsCollabosetAl extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // dropping column
        Schema::table('bids', function (Blueprint $table) {
            //
            $table->dropForeign("bids_proj_id_foreign");
            $table->dropColumn("proj_id");
        });

        // adding column
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
            $table->string("status_stage");

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
