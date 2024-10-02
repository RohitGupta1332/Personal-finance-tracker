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
        try {
            // Ensure the created_date is in the correct format (YYYY-MM-DD)
            $createdDate = $data['created_date'] . '-01'; // Append '-01' to make it a complete date
    
            // Check if the budget entry already exists
            $checkQuery = "SELECT COUNT(*) FROM budget 
                           WHERE user_id = :user_id 
                           AND category_id = :category_id 
                           AND DATE_FORMAT(created_date, '%Y-%m') = DATE_FORMAT(:created_date, '%Y-%m')";
            
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':user_id', $data['user_id']);
            $checkStmt->bindParam(':category_id', $data['category_id']);
            $checkStmt->bindParam(':created_date', $createdDate);
            $checkStmt->execute();
    
            $exists = $checkStmt->fetchColumn();
    
            if ($exists) {
                // Update existing budget entry
                $updateQuery = "UPDATE budget 
                                SET assigned = :assigned 
                                WHERE user_id = :user_id 
                                AND category_id = :category_id 
                                AND DATE_FORMAT(created_date, '%Y-%m') = DATE_FORMAT(:created_date, '%Y-%m')";
                
                $updateStmt = $this->db->prepare($updateQuery);
                $updateStmt->bindParam(':user_id', $data['user_id']);
                $updateStmt->bindParam(':category_id', $data['category_id']);
                $updateStmt->bindParam(':created_date', $createdDate);
                $updateStmt->bindParam(':assigned', $data['assigned']);
                
                return $updateStmt->execute();
            } else {
                // Insert new budget entry
                $insertQuery = "INSERT INTO budget(user_id, created_date, category_id, assigned) 
                                VALUES (:user_id, :created_date, :category_id, :assigned)";
                
                $insertStmt = $this->db->prepare($insertQuery);
                $insertStmt->bindParam(':user_id', $data['user_id']);
                $insertStmt->bindParam(':created_date', $createdDate); // Use modified date
                $insertStmt->bindParam(':category_id', $data['category_id']);
                $insertStmt->bindParam(':assigned', $data['assigned']);
                
                return $insertStmt->execute();
            }
        } catch(Exception $e) {
            echo 'Error inserting or updating budget: ' . $e->getMessage();
            return false;
        }
    }

    public function getBudget($user_id, $date) {
        try {
            // Modify the date to append '-01'
            $formattedDate = $date . '-01'; // Now the date will be in the format 'YYYY-MM-01'
            
            $query = "SELECT 
                            c.category_id, 
                            c.category_name, 
                            c.category_type, 
                            IFNULL(b.assigned, 0) AS assigned, 
                            IFNULL(SUM(t.outflow), 0) AS activity
                        FROM 
                            Category c
                        LEFT JOIN 
                            Budget b 
                        ON 
                            c.category_id = b.category_id
                        AND 
                            c.user_id = b.user_id
                        AND 
                            b.created_date = :date
                        LEFT JOIN 
                            `Transaction` t
                        ON 
                            c.category_id = t.category_id
                        AND 
                            c.user_id = t.user_id
                        AND 
                            DATE_FORMAT(t.created_date, '%Y-%m') = DATE_FORMAT(:date, '%Y-%m')
                        WHERE 
                            c.user_id = :user_id
                        GROUP BY 
                            c.category_id, 
                            c.category_name, 
                            c.category_type, 
                            b.assigned
                        "; 
    
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':user_id', $user_id);
            $runQuery->bindParam(':date', $formattedDate); 
    
            $runQuery->execute();
    
            return $runQuery->fetchAll(PDO::FETCH_ASSOC); // Fetching as associative array for clearer keys
        } catch (Exception $e) {
            echo 'Error: ' . $e->getMessage();
            return null;
        }
    }
    
    
}
?>
