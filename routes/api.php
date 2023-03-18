<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(PostController::class)->prefix('posts')->as('apiPosts.')->group(function () {
    Route::get('', 'index')->name('index');
    Route::post('', 'store')->name('store');
    Route::get('{id}', 'show')->name('show');
    Route::put('{id}', 'update')->name('update');
    Route::delete('{id}', 'destroy')->name('destroy');
});