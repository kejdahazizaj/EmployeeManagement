<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('dark-mode-switcher', array('uses' => 'DarkModeController@switch'))->name('dark-mode-switcher');
Route::get('color-scheme-switcher/{color_scheme}',array('uses' => 'ColorSchemeController@switch'))->name('color-scheme-switcher');

// route to show the login form
Route::get('login', array('uses' => 'LoginController@show'))->name('login');

// route to process the form
Route::post('login', array('uses' => 'LoginController@doLogin'))->name('postlogin');

Route::get('/flights', function () {
    // Only authenticated users may access this route...
    return "hello";
})->middleware('auth');

Route::get('home', array('uses' => 'AdminController@home'))->name('crud-data-list');
//Route::get('/', array('uses' => 'PageController@dashboardOverview1'))->name('dashboard-overview-1');
Route::get('logout', [AuthController::class, 'logout'])->name('logout');
Route::get('addEmployee',array('uses' => 'AdminController@createEmployee'))->name('addEmployee');
Route::post('addEmployee',array('uses' => 'AdminController@createEmployeePost'))-> name('addEmployee');
