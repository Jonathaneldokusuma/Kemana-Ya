<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Keep /api in the route path instead of treating it as the script directory.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
// Vercel terminates TLS before forwarding requests to the PHP process.
$_SERVER['HTTPS'] = 'on';
$_SERVER['SERVER_PORT'] = 443;

require __DIR__.'/../vendor/autoload.php';

// Only temporary framework files live here; persistent data belongs in Neon.
$storage = sys_get_temp_dir().'/kemanaya-storage';
foreach (['framework/cache/data', 'framework/sessions', 'framework/views', 'logs'] as $directory) {
    $path = $storage.'/'.$directory;
    if (! is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

putenv('APP_PACKAGES_CACHE='.$storage.'/framework/cache/packages.php');
putenv('APP_SERVICES_CACHE='.$storage.'/framework/cache/services.php');

$app = require __DIR__.'/../bootstrap/app.php';
$app->useStoragePath($storage);
$app->handleRequest(Request::capture());
