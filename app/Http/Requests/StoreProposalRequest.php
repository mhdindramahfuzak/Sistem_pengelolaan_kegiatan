<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProposalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // PERBAIKAN: Ubah dari false menjadi true.
        // Ini mengizinkan request untuk melanjutkan ke controller,
        // di mana otorisasi yang lebih spesifik akan ditangani oleh policy.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_proposal' => ['required', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'tujuan' => ['required', 'string'],
            'tanggal_pengajuan' => ['required', 'date'],
            'dokumen_path' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:2048'],
        ];
    }
}
