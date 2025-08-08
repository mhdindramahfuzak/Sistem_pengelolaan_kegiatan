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
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->string('nama_proposal');
            $table->text('deskripsi');
            $table->text('tujuan');
            $table->string('dokumen_path')->nullable();
            $table->date('tanggal_pengajuan');
            $table->string('status')->default('diajukan');
            $table->text('alasan_penolakan')->nullable();
            
            // PERBAIKAN: Ubah user_id menjadi pengusul_id
            $table->foreignId('pengusul_id')->constrained('users');
            $table->foreignId('verifikator_id')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
