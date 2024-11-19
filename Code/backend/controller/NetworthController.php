<?php

require '../vendor/autoload.php';
use \Firebase\JWT\JWT;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

include 'C:\xampp\htdocs\Minor Project\Code\backend\config\Database.php';
include 'C:\xampp\htdocs\Minor Project\Code\backend\model\Networth.php';

$database = new Database();
$db = $database->connect();

$networth = new Networth($db);

$secretkey = "owt125";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $headers = getallheaders();

    if (!empty($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        $jwt = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded_data = JWT::decode($jwt, new \Firebase\JWT\Key($secretkey, 'HS256'));

            $user_id = $decoded_data->user_id->id;
            
            if (isset($_GET['date'])) {
                $date = $_GET['date'];
                
                $networthRecords = $networth->getNetworth($user_id);
                
                if ($networthRecords) {
                    http_response_code(200);
                    echo json_encode(["networth_records" => $networthRecords]);
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "No net worth records found for the given date"]);
                }
            } else {
                // If no date is provided, fetch the last recorded month
                $lastMonth = $networth->getLastRecordedMonth($user_id);

                if ($lastMonth) {
                    echo json_encode(["last_month" => $lastMonth]);
                } else {
                    echo json_encode(["message" => "No net worth record found"]);
                }
            }

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["message" => "Invalid token"]);
        }
    } else {
        http_response_code(400); 
        echo json_encode(["message" => "Authorization token not provided"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $result = $networth->addNetworth($data);

    if ($result) {
        http_response_code(201);
        echo json_encode(["message" => "Insert Successful"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Insert Failed"]);
    }
}

?>
