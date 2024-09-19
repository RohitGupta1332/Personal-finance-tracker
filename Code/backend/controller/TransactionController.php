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
include 'C:\xampp\htdocs\Minor Project\Code\backend\model\Transaction.php';

$conn = new Database();
$db = $conn->connect();
$secretkey = "owt125";

$transaction = new Transaction($db);

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $transaction->insertData($data);

    if($result){
        http_response_code(201);
        echo json_encode(["message" => "Insert successful"]);
    }
    else{
        http_response_code(500);
        echo json_encode(["message" => "Insert Failed"]);
    }
}

else if($_SERVER['REQUEST_METHOD'] == 'GET'){

    $headers = getallheaders();

    if (!empty($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        // Remove "Bearer " from the header value to extract the token
        $jwt = str_replace('Bearer ', '', $authHeader);

        try {
            // Decode the JWT
            $decoded_data = JWT::decode($jwt, new \Firebase\JWT\Key($secretkey, 'HS256'));

            // Extract the user ID from the token
            $user_id = $decoded_data->user_id->id;

            // Check if 'ac_id' is provided in the query parameters
            if (isset($_GET['ac_id'])) {
                $ac_id = $_GET['ac_id'];
                $result = $transaction->getTransactionsByUserIdAndAccountId($user_id, $ac_id);
            }else if (isset($_GET['summary']) && $_GET['summary'] == 'monthly') {
                // Fetch monthly income and expense summary
                $result = $transaction->getMonthlyIncomeAndExpense($user_id);
            }
             else {
                $result = $transaction->getTransactionsByUserId($user_id);
            }

            if ($result) {
                http_response_code(200);
                echo json_encode([
                "data" => $result,
                "message" => "Data received"
            ]);
            } else {
                http_response_code(404);
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


else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $headers = getallheaders();

    if (!empty($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        // Remove "Bearer " from the header value to extract the token
        $jwt = str_replace('Bearer ', '', $authHeader);

        try {
            // Decode the JWT
            $decoded_data = JWT::decode($jwt, new \Firebase\JWT\Key($secretkey, 'HS256'));

            // Extract the user ID from the token
            $user_id = $decoded_data->user_id->id;

            // Check if 'ac_id' is provided in the query parameters
            if (isset($_GET['transaction_id'])) {
                $transaction_id = $_GET['transaction_id'];
                $result = $transaction->deleteTransactionsBytransactionId($transaction_id);
                
            } else if(isset($_GET['ac_id'])){
                $ac_id = $_GET['ac_id'];
                $result = $transaction->deleteTransactionsByUserIdAndAccountId($user_id, $ac_id);
            }

            if ($result) {
                http_response_code(200); // OK
                echo json_encode(["message" => "Delete successful"]);
            } else {
                http_response_code(404); // Not Found
                echo json_encode(["message" => "Record not found"]);
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

else{
    http_response_code(405);
    echo json_encode(["message" => "Invalid request method"]);
}
?>
