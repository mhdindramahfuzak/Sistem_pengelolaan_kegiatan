<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreKontrakRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check(); // Izinkan semua user yang sudah login
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // PERBAIKAN: Sesuaikan dengan field yang dibutuhkan controller
            'nama_pihak_ketiga' => 'required|string|max:255',
            'nomor_kontrak' => 'required|string|max:255',
            'tanggal_kontrak' => 'required|date',
            'nilai_kontrak' => 'nullable|numeric|min:0', // Nilai kontrak opsional
            'dokumen_kontrak' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_pihak_ketiga.required' => 'Nama pihak ketiga wajib diisi.',
            'nomor_kontrak.required' => 'Nomor kontrak wajib diisi.',
            'tanggal_kontrak.required' => 'Tanggal kontrak wajib diisi.',
            'tanggal_kontrak.date' => 'Format tanggal kontrak tidak valid.',
            'nilai_kontrak.numeric' => 'Nilai kontrak harus berupa angka.',
            'nilai_kontrak.min' => 'Nilai kontrak tidak boleh negatif.',
            'dokumen_kontrak.required' => 'Dokumen kontrak wajib diunggah.',
            'dokumen_kontrak.file' => 'Dokumen kontrak harus berupa file.',
            'dokumen_kontrak.mimes' => 'Dokumen kontrak harus berformat PDF, DOC, atau DOCX.',
            'dokumen_kontrak.max' => 'Ukuran dokumen kontrak maksimal 2MB.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nama_pihak_ketiga' => 'nama pihak ketiga',
            'nomor_kontrak' => 'nomor kontrak',
            'tanggal_kontrak' => 'tanggal kontrak',
            'nilai_kontrak' => 'nilai kontrak',
            'dokumen_kontrak' => 'dokumen kontrak',
        ];
    }
}