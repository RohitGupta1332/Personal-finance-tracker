<?php
class User {
    private $user_id;
    private $user_name;
    private $email;
    private $password;

    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createUser($data) {
        try {
            $this->user_name = $data['user_name'];
            $this->email = $data['email'];
            $this->password = password_hash($data['password'], PASSWORD_BCRYPT); // Hash the password

            if (!$this->isEmailUnique($this->email)) {
                return false; // Email already exists
            }

            $query = "INSERT INTO user (user_name, email, password) VALUES (:user_name, :email, :password)";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':user_name', $this->user_name);
            $runQuery->bindParam(':email', $this->email);
            $runQuery->bindParam(':password', $this->password);

            return $runQuery->execute();
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    private function isEmailUnique($email) {
        try {
            $query = "SELECT * FROM user WHERE email = :email"; 
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':email', $email);
            $runQuery->execute(); 

            $result = $runQuery->fetchAll();

            return empty($result);
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }
}
?>
