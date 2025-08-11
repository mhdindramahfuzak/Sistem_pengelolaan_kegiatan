<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kegiatans', function (Blueprint $table) {
            // Tambahkan kolom status_akhir setelah kolom tahapan
            // Bisa berupa string, dan bisa null jika ada kegiatan lama yang belum punya status.
            $table->string('status_akhir')->nullable()->after('tahapan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kegiatans', function (Blueprint $table) {
            $table->dropColumn('status_akhir');
        });
    }
};