<?php

require '../vendor/autoload.php';
use \Firebase\JWT\JWT;  // Correctly use JWT in uppercase

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

header('Content-Type: application/json');

include 'C:\xampp\htdocs\Minor Project\Code\backend\config\Database.php';
include 'C:\xampp\htdocs\Minor Project\Code\backend\model\Accounts.php';

$conn = new Database();
$db = $conn->connect();
$secretkey = "owt125";

$accounts = new Accounts($db);

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $result = $accounts->insertData($data);

    if ($result) {
        http_response_code(201); // Created
        echo json_encode(["message" => "Account created successfully"]);
    } else {
        http_response_code(500); // Internal server error
        echo json_encode(["message" => "Failed to create account"]);
    }
}
// Handle GET request
else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $headers = getallheaders();
    
    if (!empty($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];        
        // Remove "Bearer " from the header value to extract the token
        $jwt = str_replace('Bearer ', '', $authHeader);

        try {
            // Decode the JWT
            $decoded_data = JWT::decode($jwt, new \Firebase\JWT\Key($secretkey, 'HS256'));

            $result = $accounts->getData($decoded_data->user_id->id);

            if ($result) {
                http_response_code(200); // OK
                echo json_encode([
                    "data" => $result,
                    "message" => "Data received"
                ]);
            } else {
                http_response_code(404); // Not Found
                echo json_encode(["message" => "Data not found"]);
            }
        } catch (Exception $e) {
            http_response_code(401); // Unauthorized
            echo json_encode(["message" => "Invalid token"]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Authorization token not provided"]);
    }
}

// Handle DELETE request
else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $result = $accounts->deleteData($id);

        if ($result) {
            http_response_code(200); // OK
            echo json_encode(["message" => "Delete successful"]);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(["message" => "Record not found"]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Missing ID parameter"]);
    }
}
// Handle invalid methods
else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Invalid request method"]);
}
?>
