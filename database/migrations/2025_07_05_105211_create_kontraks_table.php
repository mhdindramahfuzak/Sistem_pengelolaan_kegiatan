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
        Schema::create('kontraks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kegiatan_id')->constrained('kegiatans')->onDelete('cascade');
            $table->string('nama_kontrak');
            $table->string('nomor_kontrak'); // TAMBAHKAN field ini
            $table->date('tanggal_kontrak'); // TAMBAHKAN field ini
            $table->decimal('nilai_kontrak', 15, 2)->nullable(); // TAMBAHKAN field ini untuk nilai kontrak
            $table->string('file_path'); // Path untuk file kontrak
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kontraks');
    }
};