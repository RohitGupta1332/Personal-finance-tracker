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
include 'C:\xampp\htdocs\Minor Project\Code\backend\model\Category.php';

$conn = new Database();
$db = $conn->connect();

$category = new Category($db);

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    if(isset($_GET['id'])){
        $user_id = $_GET['id'];
        if(isset($_GET['date'])){
            $date = $_GET['date'];
            $result = $category->getTotalCategoryWise($user_id, $date);
            if ($result) {
                http_response_code(200);
                echo json_encode([
                    "data" => $result,
                    "message" => "Data received"
                ]);
            } 
            else {
                http_response_code(404);
                echo json_encode(["message" => "Data not found"]);
            }
        }
    }
    else {
        http_response_code(400);
        echo json_encode(["message" => "Missing user_id parameter"]);
    }
}