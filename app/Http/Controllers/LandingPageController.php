<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    /**
     * Menampilkan halaman landing.
     */
    public function index()
    {
        // Ini akan memberitahu Inertia untuk me-render file 'Landing.jsx'
        // yang akan kita buat nanti.
        return Inertia::render('Landing');
    }
}