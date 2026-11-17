<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'KemanaYa API',
        'baseUrl' => url('/api'),
        'endpoints' => [
            'GET /api/places' => 'Daftar tempat (publik)',
            'GET /api/places/{id}' => 'Detail tempat (publik)',
            'POST /api/auth/register' => 'Daftar akun',
            'POST /api/auth/login' => 'Masuk dan mendapatkan token',
            'GET /api/me' => 'Profil sendiri (Bearer token)',
            'PATCH /api/me' => 'Ubah profil (Bearer token)',
            'POST /api/places' => 'Tambah tempat (Bearer token)',
            'PUT /api/places/{id}/rating' => 'Beri rating (Bearer token)',
            'POST /api/auth/logout' => 'Keluar (Bearer token)',
        ],
    ]);
});
