<?php

use App\Http\Controllers\PasarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard');
    Route::resource('/pasar', PasarController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
