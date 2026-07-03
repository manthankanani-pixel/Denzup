<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

// Get JSON POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// If raw JSON is empty, check standard $_POST
if (empty($data)) {
    $data = $_POST;
}

// Extract and sanitize input parameters
$name = isset($data["name"]) ? strip_tags(trim($data["name"])) : "";
$phone = isset($data["phone"]) ? strip_tags(trim($data["phone"])) : "";
$email = isset($data["email"]) ? filter_var(trim($data["email"]), FILTER_SANITIZE_EMAIL) : "";
$service = isset($data["service"]) ? strip_tags(trim($data["service"])) : "";
$message = isset($data["message"]) ? strip_tags(trim($data["message"])) : "";

// Validate required fields
if (empty($name) || empty($phone) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email address format."]);
    exit;
}

// Admin email destination
$to = "mnthnkanani@gmail.com"; // Change to your preferred email address

// Subject line
$subject = "New Contact Inquiry - Danzup Studio";

// HTML Message Body
$body = "
<html>
<head>
    <title>New Contact Inquiry</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; }
        .header { background: #0f172a; color: #d4af37; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #0f172a; }
        .value { margin-top: 5px; }
        .footer { font-size: 11px; color: #888; text-align: center; margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Danzup Studio Inquiry</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>$phone</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>$email</div>
            </div>
            <div class='field'>
                <div class='label'>Interested Program:</div>
                <div class='value'>$service</div>
            </div>
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>$message</div>
            </div>
        </div>
        <div class='footer'>
            This email was sent automatically from the Danzup Studio Contact Form.
        </div>
    </div>
</body>
</html>
";

// Headers for HTML Mail
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Danzup Webform <noreply@danzupstudio.com>" . "\r\n";
$headers .= "Reply-To: $name <$email>" . "\r\n";

// Send email using PHP mail() function
if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Your inquiry has been sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: Failed to send email."]);
}
?>
