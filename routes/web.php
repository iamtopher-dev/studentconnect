<?php

use Illuminate\Support\Facades\Route;

Route::get('{any}', function () {
    return view('app'); // or wherever your React index.html is located
})->where('any', expression: '.*');
