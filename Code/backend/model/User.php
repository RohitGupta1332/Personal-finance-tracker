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
                            (:user_id, 'Bills', 'Electricity'),
                            (:user_id, 'Bills', 'Water'),
                            (:user_id, 'Bills', 'Rent'),
                            (:user_id, 'Bills', 'Internet'),
                            (:user_id, 'Bills', 'Phone'),
    
                            (:user_id, 'Needs', 'Groceries'),
                            (:user_id, 'Needs', 'Transport'),
                            (:user_id, 'Needs', 'Healthcare'),
                            (:user_id, 'Needs', 'Insurance'),
                            (:user_id, 'Needs', 'Education'),
    
                            (:user_id, 'Wants', 'Dining Out'),
                            (:user_id, 'Wants', 'Entertainment'),
                            (:user_id, 'Wants', 'Hobbies'),
                            (:user_id, 'Wants', 'Travel'),
                            (:user_id, 'Wants', 'Shopping')";
    
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
    

    public function isEmailUnique($email) {
        try {
            $query = "SELECT * FROM user WHERE email = :email"; 
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':email', $email);
            $runQuery->execute();

            $result = $runQuery->fetch();

            return $result ? true : false;
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
