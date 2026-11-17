<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\PlaceController;
use App\Http\Middleware\ApiToken;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:10,1')->group(function () {
    Route::post('auth/register', [AccountController::class, 'register']);
    Route::post('auth/login', [AccountController::class, 'login']);
});
Route::get('places', [PlaceController::class, 'index']);
Route::get('places/{place}/photo', [PlaceController::class, 'photo'])->whereNumber('place');
Route::get('places/{place}', [PlaceController::class, 'show'])->whereNumber('place');
Route::middleware([ApiToken::class, 'throttle:120,1'])->group(function () {
    Route::get('me', [AccountController::class, 'show']);
    Route::patch('me', [AccountController::class, 'update']);
    Route::post('auth/logout', [AccountController::class, 'logout']);
    Route::post('places', [PlaceController::class, 'store']);
    Route::delete('places/{place}', [PlaceController::class, 'destroy'])->whereNumber('place');
    Route::patch('places/{place}/location', [PlaceController::class, 'updateLocation'])->whereNumber('place');
    Route::put('places/{place}/rating', [PlaceController::class, 'rate'])->whereNumber('place');
});
