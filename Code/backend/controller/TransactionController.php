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
include 'C:\xampp\htdocs\Minor Project\Code\backend\model\Transaction.php';

$conn = new Database();
$db = $conn->connect();

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
    if (isset($_GET['id'])) {
        $user_id = $_GET['id'];

        if (isset($_GET['ac_id'])) {
            $ac_id = $_GET['ac_id'];
            $result = $transaction->getTransactionsByUserIdAndAccountId($user_id, $ac_id);
        } else {
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
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Missing user_id parameter"]);
    }
}

else if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
    if(isset($_GET['id'])) {
        $user_id = $_GET['id'];

        if (isset($_GET['ac_id'])) {
            $ac_id = $_GET['ac_id'];
            $result = $transaction->deleteTransactionsByUserIdAndAccountName($user_id, $ac_id);
        } else {
            $result = $transaction->deleteTransactionsBytransactionId($user_id);
        }

        if ($result) {
            http_response_code(200);
            echo json_encode(["message" => "Delete successful"]);
        }
        else {
            http_response_code(404);
            echo json_encode(["message" => "Record not found"]);
        }
    }
    else {
        http_response_code(400);
        echo json_encode(["message" => "Missing ID parameter"]);
    }
}

else{
    http_response_code(405);
    echo json_encode(["message" => "Invalid request method"]);
}
?>
