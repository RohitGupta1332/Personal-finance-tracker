<?php
class Transaction{
    private $id;
    private $user_id;
    private $ac_id;
    private $created_date;
    private $payee;
    private $category_id;
    private $outflow;
    private $inflow;
    private $cleared;

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function insertData($data){
        try{
            // $this->id = $data['id'];
            $this->user_id = $data['user_id'];
            $this->ac_id = $data['ac_id'];
            $this->created_date = $data['created_date'];
            $this->payee = $data['payee'];
            $this->category_id = $data['category_id'];
            $this->outflow = $data['outflow'];
            $this->inflow = $data['inflow'];
            $this->cleared = $data['cleared'];

            $query = "INSERT INTO Transaction (user_id, ac_id, created_date, payee, category_id, outflow, inflow, cleared) VALUES (:user_id, :ac_id, :created_date, :payee, :category_id, :outflow, :inflow, :cleared)";

            $runQuery = $this->db->prepare($query);

            // $runQuery->bindParam(':id', $this->id);
            $runQuery->bindParam(':user_id', $this->user_id);
            $runQuery->bindParam(':ac_id', $this->ac_id);
            $runQuery->bindParam(':created_date', $this->created_date);
            $runQuery->bindParam(':payee', $this->payee);
            $runQuery->bindParam(':category_id', $this->category_id);
            $runQuery->bindParam(':outflow', $this->outflow);
            $runQuery->bindParam(':inflow', $this->inflow);
            $runQuery->bindParam(':cleared', $this->cleared);

            return $runQuery->execute();

        }
        catch(Exception $e){
            echo "Error: " . $e->getMessage();
            return false;
        }

    }
    public function getTransactionsByUserId($id){ //pass the user id
        try{
            $query = "SELECT * FROM Transaction WHERE user_id = :id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $id);
            $runQuery->execute();
            $result = $runQuery->fetchAll();
            return $result;
        }
        catch(Exception $e){
            echo "Error: ".$e->getMessage();
            return null;
        }
    }

    public function getMonthlyIncomeAndExpense($user_id){
        try{
            $query = "SELECT DATE_FORMAT(created_date, '%Y-%m') AS month, 
                         SUM(CASE WHEN inflow > 0 THEN inflow ELSE 0 END) AS total_income,
                         SUM(CASE WHEN outflow > 0 THEN outflow ELSE 0 END) AS total_expense
                  FROM Transaction 
                  WHERE user_id = :user_id
                  GROUP BY month
                  ORDER BY month ASC";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':user_id', $user_id);
            $runQuery->execute();
            $result = $runQuery->fetchAll();

            return $result;
        }
        catch(Exception $e){
            error_log("Error: " . $e->getMessage());
            return null;
        }
    }
    public function getTransactionsByUserIdAndAccountId($id, $ac_id) {
        try {
            $query = "
                SELECT 
                    t.*, 
                    a.ac_name, 
                    c.category_name
                FROM 
                    transaction t
                JOIN 
                    Accounts a ON t.ac_id = a.ac_id
                JOIN 
                    Category c ON t.category_id = c.category_id
                WHERE 
                    t.user_id = :id AND t.ac_id = :ac_id
            ";
    
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $id);
            $runQuery->bindParam(':ac_id', $ac_id);
            $runQuery->execute();
            $result = $runQuery->fetchAll();
            return $result;
        } catch (Exception $e) {
            // Handle or log the exception as needed
            return null;
        }
    }
    
    public function deleteTransactionsBytransactionId($id){ //pass the transaction id
        try{
            $query = "DELETE FROM Transaction WHERE id = :id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $id);
            $runQuery->execute();

            $affectedRows = $runQuery->rowCount();

            return $affectedRows > 0;
        }
        catch(Exception $e){
            echo "Error: ".$e->getMessage();//replace every error message with error_log()
            return false;
        }
    }
    public function deleteTransactionsByUserIdAndAccountName($id, $name){
        try{
            $query = "DELETE FROM Transaction WHERE user_id = :id AND ac_name = :name";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $id);
            $runQuery->bindParam(':name', $name);
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