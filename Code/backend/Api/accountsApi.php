<?php
include 'C:\xampp\htdocs\Minor Project\Code\backend\config\Database.php';
include 'C:\xampp\htdocs\Minor Project\Code\backend\classes\Accounts.php';

$conn = new Database();
$db = $conn->connect();

$accounts = new Accounts($db);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $result = $accounts->create($data);

    if ($result) {
        echo json_encode(["message" => "Account created successfully"]);
    } else {
        echo json_encode(["message" => "Failed to create account"]);
    }
} else {
    echo json_encode(["message" => "Invalid request method"]);
}
?>
