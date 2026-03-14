<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function getUserLogged()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(null, 401);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'role' => strtoupper($user->role),
        ]);
    }
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'identifier' => 'required|string',
            'password'   => 'required|string',
        ]);

        $identifier = $credentials['identifier'];
        $password   = $credentials['password'];

        // Detect login field (email or student number)
        $loginField = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'student_no';

        $key = Str::lower($identifier) . '|' . $request->ip();

        $maxAttempts = 3;

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {

            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'status'  => 'error',
                'message' => "Too many login attempts. Try again in {$seconds} seconds."
            ], 429);
        }

        // Attempt login
        if (Auth::attempt([$loginField => $identifier, 'password' => $password])) {

            // Clear attempts after successful login
            RateLimiter::clear($key);

            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json([
                'status'  => 'success',
                'message' => 'Login successful',
                'user'    => [
                    'id'   => $user->id,
                    'name' => $user->name,
                    'role' => strtoupper($user->role),
                ],
            ], 200);
        }

        /*
    |----------------------------------------
    | Increment waiting time
    |----------------------------------------
    | 1st fail = 60 sec
    | 2nd fail = 120 sec
    | 3rd fail = 180 sec
    */

        $attempts = RateLimiter::attempts($key) + 1;
        $decaySeconds = $attempts * 60;

        RateLimiter::hit($key, $decaySeconds);

        return response()->json([
            'status'  => 'error',
            'message' => 'The provided credentials do not match our records.'
        ], 401);
    }


    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'course'                 => 'required|string|max:6',
            'student_no'            => 'nullable|string|unique:users,student_no',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = new User();
        $user->name        = $request->name;
        $user->email       = $request->email;
        $user->student_no  =  $request->student_no;
        $user->course  =  $request->course;
        $user->role        = 'STUDENT';
        $user->password    = Hash::make($request->password);
        $user->save();

        $token = $user->createToken('authToken')->accessToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Registration successful',
            'data'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ], 200);
    }
}
