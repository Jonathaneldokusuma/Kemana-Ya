<?php

return [
    'paths' => ['api/*'], 'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', env('FRONTEND_URLS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:8100,http://127.0.0.1:8100'))))),
    'allowed_origins_patterns' => [], 'allowed_headers' => ['Content-Type', 'Accept', 'Authorization'],
    'exposed_headers' => [], 'max_age' => 0, 'supports_credentials' => false,
];
