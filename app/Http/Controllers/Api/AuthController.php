<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'identifier' => 'required|string',
            'password'   => 'required|string',
        ]);

        $identifier = $credentials['identifier'];
        $password = $credentials['password'];

        $loginField = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'student_no';

        if (Auth::attempt([$loginField => $identifier, 'password' => $password])) {
            $user = User::where($loginField, $identifier)->first();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status'  => 'success',
                'message' => 'Login successful',
                'data'    => $user,
                'token'   => $token,
            ], 200);
        }

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
            'password'              => 'required|string|min:8|confirmed', // ✅ Must have password_confirmation
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
