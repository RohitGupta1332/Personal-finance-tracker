<?php
require '../vendor/autoload.php';
use \Firebase\JWT\JWt;

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
    $result = $user->loginUser($data);
    if($result != null){

        $iss = "localhost";
        $iat = time();
        $nbf = $iat + 10;
        $exp = $iat + 60;
        $aud = "myuser";
        $user_data = array(
            "id" => $result['user_id'],
            "name" => $result['user_name'],
            "email" => $result['email'], 
        );

        $secret_key = "owt125";

        $payload_info = array(
            "iss" => "localhost", //issuer
            "iat" => $iat, //issue time
            "nbf" => $nbf, //not before time....after how much time the token will be valid
            "exp" => $exp, //expiration time
            "aud" => $aud, //for which user
            "user_id" => $user_data
        );

        $jwt = JWT::encode($payload_info, $secret_key, 'HS256');

        http_response_code(200);
        echo json_encode([
            'data' => $result,
            "jwt" => $jwt,
            'message' => 'User logged in successfully'

        ]);
    }
    else{
        http_response_code(500);
        echo json_encode([
            'message' => 'User not found' 
        ]);
    }
}
else{
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Something went wrong"]);
}

?>