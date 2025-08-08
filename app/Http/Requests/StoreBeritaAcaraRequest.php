<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBeritaAcaraRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Otorisasi ditangani di controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file_berita_acara' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'detail_akhir_kegiatan' => 'required|string',
            'status_akhir' => ['required', Rule::in(['Selesai', 'Ditunda', 'Dibatalkan'])],
        ];
    }
}
