<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewTableBidCollaboratorsetAlChanges extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bid_collaborators', function (Blueprint $table) {
            $table->increments("bid_collabo_id");
            $table->string("bid_collabo_type");
            $table->string("bid_collabo_role");
            
            $table->timestamps();
            
            $table->integer("bid_id")->unsigned();
            $table->foreign("bid_id")->references("bid_id")->on("bids");
        });

        // dropping column
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
            $table->dropColumn("bid_id");

        });

        // dropping column
        Schema::table('project_collaborators', function (Blueprint $table) {
            //
            $table->dropColumn("status_stage");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bid_collaborators');
    }
}
