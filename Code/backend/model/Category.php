<?php
class Category{
    private $category_id;
    private $user_id;
    private $category_type;
    private $category_name;

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function getTotalCategoryWise($user_id, $date){
       try{
            $query = "SELECT 
                        c.category_type, 
                        SUM(t.outflow) AS total_spending
                        FROM 
                            `transaction` t
                        JOIN 
                            `category` c ON t.category_id = c.category_id
                        WHERE 
                            t.user_id = :user_id  
                        AND DATE_FORMAT(t.created_date, '%Y-%m') = :date
                        GROUP BY 
                            c.category_type
                        ORDER BY 
                            total_spending DESC";

            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':user_id', $user_id);
            $runQuery->bindParam(':date', $date);
            $runQuery->execute();

            return $runQuery->fetchAll();
        }
        catch(Exception $e){
            echo 'Error: ' . $e->getMessage();
            return null;
        }
    }

    public function insertCategory($data){
        try{
            $this->user_id = $data['user_id'];
            $this->category_type = $data['category_type'];
            $this->category_name = $data['category_name'];

            $query = "INSERT INTO category(user_id, category_type, category_name) VALUES (:user_id, :category_type, :category_name)";
            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':user_id', $this->user_id);
            $runQuery->bindParam(':category_type', $this->category_type);
            $runQuery->bindParam(':category_name', $this->category_name);

            return $runQuery->execute();
        }
        catch(Exception $e){
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function getCategories($user_id){
        try{
            $query = "SELECT * FROM category WHERE user_id = 0 OR user_id = :user_id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':user_id', $user_id);
            $runQuery->execute();
            return $runQuery->fetchAll();

        }
        catch(Exception $e){
            echo "Error: " . $e->getMessage();
            return null;
        }
    }
    public function deleteCategory($category_id){
        try{
            $query = "DELETE FROM category WHERE category_id = :id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $category_id);
            $runQuery->execute();

            $affectedRows = $runQuery->rowCount();

            return $affectedRows > 0;
        }
        catch(Exception $e){
            echo "Error: ".$e->getMessage();//replace every error message with error_log()
            return false;
        }
    }
}

?>