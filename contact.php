<?php
/**
 * Mobile Electrician – contact.php
 * Backup PHP mailer (used if FormSubmit is unavailable)
 * Place on server alongside index.html
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.mobileelectrician.co.za');
header('Access-Control-Allow-Methods: POST');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Basic spam honeypot check
if (!empty($_POST['_honey'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bot detected.']);
    exit;
}

// Sanitise inputs
$name    = htmlspecialchars(strip_tags(trim($_POST['name']    ?? '')));
$phone   = htmlspecialchars(strip_tags(trim($_POST['phone']   ?? '')));
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_SANITIZE_EMAIL);
$service = htmlspecialchars(strip_tags(trim($_POST['service'] ?? '')));
$message = htmlspecialchars(strip_tags(trim($_POST['message'] ?? '')));

// Validate required fields
if (empty($name) || empty($phone) || empty($service)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

// Validate email if provided
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

$to      = 'mobielectrician@outlook.com';
$subject = "New enquiry from mobileelectrician.co.za – {$service}";

$body  = "You have a new enquiry from your website.\n\n";
$body .= "-----------------------------------\n";
$body .= "Name    : {$name}\n";
$body .= "Phone   : {$phone}\n";
$body .= "Email   : " . ($email ?: 'Not provided') . "\n";
$body .= "Service : {$service}\n";
$body .= "Message :\n{$message}\n";
$body .= "-----------------------------------\n";
$body .= "Sent: " . date('Y-m-d H:i:s') . " SAST\n";

$headers  = "From: Website Enquiry <noreply@mobileelectrician.co.za>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => "Thanks {$name}! We'll be in touch shortly on {$phone}."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Oops! Could not send your message. Please WhatsApp us directly on 072 485 6575.'
    ]);
}