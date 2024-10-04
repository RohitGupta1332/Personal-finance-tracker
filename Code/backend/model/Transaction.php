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

    public function insertData($data) {
        try {
            // Assign the transaction data
            $this->user_id = $data['user_id'];
            $this->ac_id = $data['ac_id'];
            $this->created_date = $data['created_date'];
            $this->payee = $data['payee'];
            $this->category_id = $data['category_id'];
            $this->outflow = $data['outflow'];
            $this->inflow = $data['inflow'];
            $this->cleared = $data['cleared'];
    
            // Begin a transaction (for atomicity)
            $this->db->beginTransaction();
    
            // Fetch the current account balance from the Accounts table
            $query = "SELECT ac_balance FROM Accounts WHERE ac_id = :ac_id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':ac_id', $this->ac_id);
            $runQuery->execute();
            $account = $runQuery->fetch();
    
            if (!$account) {
                throw new Exception("Account not found");
            }
    
            // Calculate the new balance
            $newBalance = $account['ac_balance'];
    
            if ($this->outflow > 0) {
                // Subtract outflow from the balance if it's an expense
                $newBalance -= $this->outflow;
            } elseif ($this->inflow > 0) {
                // Add inflow to the balance if it's an income
                $newBalance += $this->inflow;
            }
    
            // Update the account balance in the Accounts table
            $updateQuery = "UPDATE Accounts SET ac_balance = :newBalance WHERE ac_id = :ac_id";
            $updateRun = $this->db->prepare($updateQuery);
            $updateRun->bindParam(':newBalance', $newBalance);
            $updateRun->bindParam(':ac_id', $this->ac_id);
            $updateRun->execute();
    
            // Insert the transaction into the Transaction table
            $insertQuery = "INSERT INTO Transaction (user_id, ac_id, created_date, payee, category_id, outflow, inflow, cleared) 
                            VALUES (:user_id, :ac_id, :created_date, :payee, :category_id, :outflow, :inflow, :cleared)";
            $runInsert = $this->db->prepare($insertQuery);
            $runInsert->bindParam(':user_id', $this->user_id);
            $runInsert->bindParam(':ac_id', $this->ac_id);
            $runInsert->bindParam(':created_date', $this->created_date);
            $runInsert->bindParam(':payee', $this->payee);
            $runInsert->bindParam(':category_id', $this->category_id);
            $runInsert->bindParam(':outflow', $this->outflow);
            $runInsert->bindParam(':inflow', $this->inflow);
            $runInsert->bindParam(':cleared', $this->cleared);
    
            // Execute the transaction insertion
            $result = $runInsert->execute();
    
            // Commit the changes if both the update and insertion were successful
            $this->db->commit();
            
            return $result;
    
        } catch (Exception $e) {
            // Rollback in case of an error
            $this->db->rollBack();
            error_log("Error: " . $e->getMessage());
            return false;
        }
    }
    
    public function getTransactionsByUserId($id){ //pass the user id
        try{
            $query = "SELECT 
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
                    t.user_id = :id";
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
    
    public function deleteTransactionsBytransactionId($id) { 
        try {
            // Begin transaction
            $this->db->beginTransaction();
    
            // Fetch the transaction details to get the outflow, inflow, and account ID
            $query = "SELECT ac_id, outflow, inflow FROM Transaction WHERE id = :id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $id);
            $runQuery->execute();
            $transaction = $runQuery->fetch();
    
            if (!$transaction) {
                throw new Exception("Transaction not found");
            }
    
            $ac_id = $transaction['ac_id'];
            $outflow = $transaction['outflow'];
            $inflow = $transaction['inflow'];
    
            // Fetch the current account balance from the Accounts table
            $accountQuery = "SELECT ac_balance FROM Accounts WHERE ac_id = :ac_id";
            $runAccountQuery = $this->db->prepare($accountQuery);
            $runAccountQuery->bindParam(':ac_id', $ac_id);
            $runAccountQuery->execute();
            $account = $runAccountQuery->fetch();
    
            if (!$account) {
                throw new Exception("Account not found");
            }
    
            // Calculate the new balance
            $newBalance = $account['ac_balance'];
    
            if ($outflow > 0) {
                // If there was an outflow, add it back to the balance
                $newBalance += $outflow;
            } elseif ($inflow > 0) {
                // If there was an inflow, subtract it from the balance
                $newBalance -= $inflow;
            }
    
            // Update the account balance in the Accounts table
            $updateQuery = "UPDATE Accounts SET ac_balance = :newBalance WHERE ac_id = :ac_id";
            $runUpdate = $this->db->prepare($updateQuery);
            $runUpdate->bindParam(':newBalance', $newBalance);
            $runUpdate->bindParam(':ac_id', $ac_id);
            $runUpdate->execute();
    
            // Delete the transaction from the Transaction table
            $deleteQuery = "DELETE FROM Transaction WHERE id = :id";
            $runDelete = $this->db->prepare($deleteQuery);
            $runDelete->bindParam(':id', $id);
            $runDelete->execute();
    
            $affectedRows = $runDelete->rowCount();
    
            // Commit the transaction if everything is successful
            $this->db->commit();
    
            return $affectedRows > 0;
        } catch (Exception $e) {
            // Rollback the transaction in case of error
            $this->db->rollBack();
            error_log("Error: " . $e->getMessage());
            return false;
        }
    }
    
    public function deleteTransactionsByUserIdAndAccountId($id, $ac_id){
        try{
            $query = "DELETE FROM Transaction WHERE user_id = :id AND ac_id = :ac_id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':id', $id);
            $runQuery->bindParam(':ac_id', $ac_id);
            $runQuery->execute();
            $affectedRows = $runQuery->rowCount();

            return $affectedRows >= 0;
        }
        catch(Exception $e){
            echo "Error: ".$e->getMessage();//replace every error message with error_log()
            return false;
        }
    }
}

?>