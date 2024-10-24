<?php

class Database{
    private $host;
    private $dbname;
    private $username;
    private $password;
    private $conn;
    
    public function connect(){
        $this->host = "localhost";
        $this->dbname = "finance_tracker";
        $this->username = "root";
        $this->password = "7439rohit";

        try{
            $this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}",$this->username,$this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        }
        catch(PDOException $e){
            return $e->getMessage();
        }
    }
}

?>