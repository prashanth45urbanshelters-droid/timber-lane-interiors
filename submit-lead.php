<?php
// Allow requests from your website only
header('Access-Control-Allow-Origin: https://timberlane.co.in');
header('Content-Type: application/json');

// API Configuration
$api_url = "https://odoo.timberlane.co.in/api/lead/create";
$api_key = "C5fN9KMLrPQ8dfBtwlprKRQDN83I4Sa4"; // Replace with new key when they regenerate

// Get data sent from your form
$input = json_decode(file_get_contents('php://input'), true);

// Sanitize inputs
$name    = isset($input['name'])    ? htmlspecialchars(strip_tags($input['name']))    : '';
$email   = isset($input['email'])   ? htmlspecialchars(strip_tags($input['email']))   : '';
$phone   = isset($input['phone'])   ? htmlspecialchars(strip_tags($input['phone']))   : '';
$service = isset($input['service']) ? htmlspecialchars(strip_tags($input['service'])) : '';

// Validate required fields
if (empty($name) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Name and phone are required']);
    exit;
}

// Build Odoo API payload
$payload = [
    "jsonrpc" => "2.0",
    "method"  => "call",
    "params"  => [
        "name"          => $name,
        "email"         => $email,
        "phone"         => $phone,
        "project_field" => $service,  // Service they selected
        "lead_source_id" => "1",
        "known_through" => "Website Contact Form"
    ]
];

// Send to Odoo
$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "LEAD-API-KEY: $api_key"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$error    = curl_error($ch);
curl_close($ch);

if ($error) {
    echo json_encode(['success' => false, 'message' => $error]);
} else {
    echo json_encode(['success' => true, 'response' => json_decode($response)]);
}
?>