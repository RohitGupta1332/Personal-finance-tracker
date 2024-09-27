<?php
class Budget {
    private $budget_id;
    private $user_id;
    private $created_date;
    private $category_id;
    private $assigned;

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function insertBudget($data){
        try{
            $month_year = $data['created_date'];

            $full_date = $month_year . '-01';

            $query = "INSERT INTO budget(user_id, created_date, category_id, assigned) VALUES (:user_id, :created_date, :category_id, :assigned)";
            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':user_id', $data['user_id']);
            $runQuery->bindParam(':created_date', $full_date);
            $runQuery->bindParam(':category_id', $data['category_id']);
            $runQuery->bindParam(':assigned', $data['assigned']);

            return $runQuery->execute();
        }
        catch(Exception $e){
            echo 'Error inserting budget: ' . $e->getMessage();
            return false;
        }
    }

    public function getBudget($user_id, $date){
        try{
            $query = "SELECT 
                        c.category_id,
                        c.category_name,
                        c.category_type,
                        IFNULL(b.assigned, 0) AS budget_amount,
                        DATE_FORMAT(b.created_date, '%Y-%m') AS budget_month
                        FROM 
                            category c
                        LEFT JOIN 
                            budget b ON c.category_id = b.category_id AND c.user_id = b.user_id 
                                    AND DATE_FORMAT(b.created_date, '%Y-%m') = :date
                        WHERE 
                            c.user_id = :user_id
                        ";
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

    public function deleteBudget($budget_id){
        try{
            $query = "DELETE FROM budget WHERE budget_id = :id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $budget_id);
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
