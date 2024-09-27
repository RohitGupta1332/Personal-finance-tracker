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
            // Set user details
            $this->user_name = $data['user_name'];
            $this->email = $data['email'];
            $this->password = password_hash($data['password'], PASSWORD_BCRYPT); // Hash the password
    
            // Check if the email is unique
            if (!$this->isEmailUnique($this->email)) {
                return false; // Email already exists
            }
    
            // Insert the new user into the 'user' table
            $query = "INSERT INTO user (user_name, email, password) VALUES (:user_name, :email, :password)";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':user_name', $this->user_name);
            $runQuery->bindParam(':email', $this->email);
            $runQuery->bindParam(':password', $this->password);
    
            if($runQuery->execute()) {
                // Get the last inserted user_id
                $user_id = $this->db->lastInsertId();
    
                // Insert default categories for the new user
                $query = "INSERT INTO category (user_id, category_type, category_name) VALUES
                            (:user_id, 'bills', 'Electricity'),
                            (:user_id, 'bills', 'Water'),
                            (:user_id, 'bills', 'Rent'),
                            (:user_id, 'bills', 'Internet'),
                            (:user_id, 'bills', 'Phone'),
    
                            (:user_id, 'needs', 'Groceries'),
                            (:user_id, 'needs', 'Transport'),
                            (:user_id, 'needs', 'Healthcare'),
                            (:user_id, 'needs', 'Insurance'),
                            (:user_id, 'needs', 'Education'),
    
                            (:user_id, 'wants', 'Dining Out'),
                            (:user_id, 'wants', 'Entertainment'),
                            (:user_id, 'wants', 'Hobbies'),
                            (:user_id, 'wants', 'Travel'),
                            (:user_id, 'wants', 'Shopping')";
    
                $runQuery = $this->db->prepare($query);
                $runQuery->bindParam(':user_id', $user_id);
    
                // Execute the category insertion query
                if($runQuery->execute()) {
                    return true; // User and categories inserted successfully
                }
            }
            return false;
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

    public function loginUser($data){
        try{
            $query = "SELECT * FROM user WHERE email = :email";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':email', $data['email']);
            $runQuery->execute();

            $result = $runQuery->fetch();

            if ($result && password_verify($data['password'], $result['password'])) {
                return $result;
            } else {
                return null;
            }
        }
        catch(Exception $e){
            echo "Error: " . $e->getMessage();
            return null;
        }
    }
}
?>
