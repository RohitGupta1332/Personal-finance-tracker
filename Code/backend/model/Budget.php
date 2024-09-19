<?php
class Budget {
    private $user_id;
    private $category_id;
    private $category_type;
    private $category_name;
    private $outflow;
    private $assigned;
    private $available;

    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Insert new budget data
    public function insertBudget($data) {
        try {
            $this->user_id = $data['user_id'];
            $this->category_id = $data['category_id'];
            $this->category_type = $data['category_type'];
            $this->category_name = $data['category_name'];
            $this->outflow = $data['outflow'];
            $this->assigned = $data['assigned'];
            $this->available = $data['available'];

            $query = "INSERT INTO budget (user_id, category_id, category_type, category_name, outflow, assigned, available) VALUES (:user_id, :category_id, :category_type, :category_name, :outflow, :assigned, :available)";

            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':user_id', $data['user_id']);
            $runQuery->bindParam(':category_id', $data['category_id']);
            $runQuery->bindParam(':category_type', $data['category_type']);
            $runQuery->bindParam(':category_name', $data['category_name']);
            $runQuery->bindParam(':outflow', $data['outflow']);
            $runQuery->bindParam(':assigned', $data['assigned']);
            $runQuery->bindParam(':available', $data['available']);

            return $runQuery->execute();

        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
            return false;
        }
    }

    // Fetch budget data by user
    public function getBudgetsByUser($user_id) {
        try {
            $query = "SELECT b.budget_id, c.category_name, SUM(b.assigned) as total_assigned 
                      FROM budget b 
                      JOIN category c ON b.category_id = c.category_id 
                      WHERE b.user_id = :user_id 
                      GROUP BY c.category_name";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':user_id', $user_id);
            $runQuery->execute();
            return $runQuery->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
            return null;
        }
    }

    // Fetch total activity from transaction table
    public function getActivityByCategory($user_id) {
        try {
            $query = "SELECT t.category_id, SUM(t.outflow) as total_activity 
                      FROM transaction t 
                      WHERE t.user_id = :user_id 
                      GROUP BY t.category_id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':user_id', $user_id);
            $runQuery->execute();
            return $runQuery->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
            return null;
        }
    }

    // Delete budget
    public function deleteBudget($budget_id) {
        try {
            $query = "DELETE FROM budget WHERE budget_id = :budget_id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':budget_id', $budget_id);
            return $runQuery->execute();
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
            return false;
        }
    }
}
?>
