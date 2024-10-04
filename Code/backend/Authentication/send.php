<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master\src\Exception.php';
require 'PHPMailer-master\src\PHPMailer.php';
require 'PHPMailer-master\src\SMTP.php';

function generateOTP($digits = 6) {
    $min = pow(10, $digits - 1);
    $max = pow(10, $digits) - 1;
    return rand($min, $max); 
}


if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $otp = generateOTP();

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; 
    $mail->SMTPAuth = true;
    $mail->Username = 'itzrg31052004@gmail.com';
    $mail->Password = 'smtvwzyyvbeqmcqg'; 
    $mail->SMTPSecure = 'ssl'; 
    $mail->Port = 465; 

    $mail->setFrom('itzrg31052004@gmail.com'); 
    $mail->addAddress($data['email']);
    $mail->isHTML(true);
    $mail->Subject = "OTP Authentication";
    $mail->Body = "Your OTP is: <strong>" . $otp . "</strong>";

    if ($mail->send()) {
        http_response_code(200); // OK
        echo json_encode(["message" => "OTP sent successfully!", "otp" => $otp]); 
    } else {
        http_response_code(500); // Internal Server Error (or another appropriate code)
        echo json_encode(["error" => "Email could not be sent. Error: "]); 
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Invalid request method."]);
}
?>