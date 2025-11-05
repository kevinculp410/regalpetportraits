<?php
// Simple PHP router for SPA: serves static files from /public if they exist,
// otherwise falls back to /public/index.html so deep routes work.

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$publicDir = __DIR__ . '/../public';
$filePath = $publicDir . $uri;

// If the requested file exists (and it's not a directory), let the built-in server handle it
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false; // Serve the requested resource as-is.
}

// Otherwise, serve index.html for SPA fallback
$indexPath = $publicDir . '/index.html';
if (file_exists($indexPath)) {
    $content = file_get_contents($indexPath);
    header('Content-Type: text/html; charset=utf-8');
    echo $content;
    return true;
}

http_response_code(404);
header('Content-Type: text/plain');
echo "index.html not found";