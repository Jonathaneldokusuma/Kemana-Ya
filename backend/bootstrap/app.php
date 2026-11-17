<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global Laravel middleware includes CORS.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(fn ($request) => $request->is('api/*'));
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }
            $status = $e instanceof ValidationException ? 422
                : ($e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500);
            $message = match ($status) {
                422 => 'Periksa kembali data yang diisi.', 401 => 'Silakan masuk kembali.',
                403 => 'Akses ditolak.', 404 => 'Data tidak ditemukan.', 429 => 'Terlalu banyak permintaan. Coba lagi nanti.',
                default => $status >= 500 ? 'Layanan sedang bermasalah. Coba lagi nanti.' : 'Permintaan tidak dapat diproses.',
            };

            return response()->json(['data' => null, 'message' => $message,
                'errors' => $e instanceof ValidationException ? $e->errors() : (object) []], $status);
        });
    })->create();
