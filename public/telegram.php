<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $phone = isset($_POST['tel']) ? htmlspecialchars(strip_tags(trim($_POST['tel']))) : '';
    $name = isset($_POST['name']) ? htmlspecialchars(strip_tags(trim($_POST['name']))) : '';

    if (empty($phone)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Phone number is required.'
        ]);
        exit;
    }

    // Lead received successfully (mock mode for portfolio deployment)
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Request submitted successfully'
    ]);
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed.'
    ]);
}
?>