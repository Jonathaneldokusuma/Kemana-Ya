<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        $record = $token ? DB::table('api_tokens')->where('hash', hash('sha256', $token))->where('expires_at', '>', now())->first() : null;
        $user = $record ? User::find($record->user_id) : null;
        abort_unless($user, 401, 'Silakan masuk kembali.');
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
