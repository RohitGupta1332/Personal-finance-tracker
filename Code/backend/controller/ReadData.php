<?php
require '../vendor/autoload.php';
use \Firebase\JWT\JWT;  // Correctly use JWT in uppercase

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

include 'C:\xampp\htdocs\Minor Project\Code\backend\config\Database.php';
include 'C:\xampp\htdocs\Minor Project\Code\backend\model\User.php';

$conn = new Database();
$db = $conn->connect();

$user = new User($db);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Get all headers
        $headers = getallheaders();

        // Check if the 'Authorization' header is present
        if (!empty($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            $secretkey = "owt125";
            
            // Remove "Bearer " from the header value to extract the token
            $jwt = str_replace('Bearer ', '', $authHeader);

            // Decode the JWT
            $decoded_data = JWT::decode($jwt, new \Firebase\JWT\Key($secretkey, 'HS256'));

            http_response_code(202);
            echo json_encode([
                "User_data" => $decoded_data,
                "message" => "Received JWT token"
            ]);
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["message" => "Authorization token not provided"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "message" => $e->getMessage(),
        ]);
    }
}
?>
