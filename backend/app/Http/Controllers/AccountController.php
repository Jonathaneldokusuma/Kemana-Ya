<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ProfileSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100', 'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|max:128', 'city' => 'nullable|string|max:255',
        ]);
        $user = DB::transaction(function () use ($data) {
            return User::create([...$data, 'profile' => ['city' => $data['city'] ?? '', 'title' => '', 'category' => '', 'challenge' => ''],
                'settings' => ['pushRecomend' => true, 'publicProfile' => true, 'compactFeed' => false]]);
        });

        return $this->session($user, 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string|max:128']);
        $user = User::where('email', $data['email'])->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => ['Email atau password salah.']]);
        }

        return $this->session($user);
    }

    private function session(User $user, int $status = 200)
    {
        $token = bin2hex(random_bytes(32));
        DB::table('api_tokens')->insert(['user_id' => $user->id, 'hash' => hash('sha256', $token), 'expires_at' => now()->addDays(7)]);

        return response()->json(['data' => ['token' => $token, 'user' => $this->profile($user)]], $status);
    }

    private function profile(User $user): array
    {
        return ['id' => $user->id, 'email' => $user->email, 'name' => $user->name, ...($user->profile ?? []), 'settings' => $user->settings ?? [], ...app(ProfileSummary::class)->forUser($user)];
    }

    public function show(Request $request)
    {
        return response()->json(['data' => $this->profile($request->user())]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100', 'title' => 'sometimes|nullable|string|max:255',
            'city' => 'sometimes|nullable|string|max:255', 'category' => 'sometimes|nullable|string|max:255',
            'challenge' => 'sometimes|nullable|string|max:255', 'settings' => 'sometimes|array:pushRecomend,publicProfile,compactFeed',
            'settings.pushRecomend' => 'sometimes|boolean', 'settings.publicProfile' => 'sometimes|boolean', 'settings.compactFeed' => 'sometimes|boolean',
        ]);
        $user = $request->user();
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        $user->profile = [...($user->profile ?? []), ...array_intersect_key($data, array_flip(['title', 'city', 'category', 'challenge']))];
        $user->settings = [...($user->settings ?? []), ...($data['settings'] ?? [])];
        $user->save();

        return $this->show($request);
    }

    public function logout(Request $request)
    {
        DB::table('api_tokens')->where('hash', hash('sha256', $request->bearerToken()))->delete();

        return response()->json(['data' => null, 'message' => 'Berhasil keluar.']);
    }
}
