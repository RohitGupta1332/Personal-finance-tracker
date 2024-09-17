<?php 
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

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $data = json_decode(file_get_contents("php://input"), true);
    $result = $user->createUser($data);
    if($result){
        http_response_code(200); // OK
        echo json_encode([
            "data" => $result,
            "message" => "User inserted"
        ]);
    } else {
        http_response_code(500); // Not Found
        echo json_encode(["message" => "Email Id already exists!"]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Something went wrong"]);
}




?>