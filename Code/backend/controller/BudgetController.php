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
include 'C:\xampp\htdocs\Minor Project\Code\backend\model\Budget.php';

$database = new Database();
$db = $database->connect();

$budget = new Budget($db);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $result = $budget->insertBudget($data);

    if ($result) {
        http_response_code(201);
        echo json_encode(["message" => "Budget entry added."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to add budget entry."]);
    }
}

else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['user_id'])) {
        $user_id = $_GET['user_id'];
        $budgets = $budget->getBudgetsByUser($user_id);

        if ($budgets) {
            $activity = $budget->getActivityByCategory($user_id);
            $response = [];

            foreach ($budgets as $budget) {
                $activityAmount = 0;
                foreach ($activity as $act) {
                    if ($act['category_id'] == $budget['category_id']) {
                        $activityAmount = $act['total_activity'];
                    }
                }

                $available = $budget['total_assigned'] - $activityAmount;
                $response[] = [
                    "category" => $budget['category_name'],
                    "total_assigned" => $budget['total_assigned'],
                    "total_activity" => $activityAmount,
                    "available" => $available
                ];
            }

            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No data found."]);
        }
    }
}
?>
