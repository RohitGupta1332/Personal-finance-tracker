<?php
$host = "localhost";
$user = "root";
$password = "7439rohit";

try{
    $conn = new PDO("mysql:host=$host;dbname=finance_tracker",$user,$password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connection Successful";
}
catch(PDOException $err){
    echo "<br>";
    echo $err->getMessage();
}
?>