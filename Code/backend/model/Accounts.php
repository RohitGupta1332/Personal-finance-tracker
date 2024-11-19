<?php
class Accounts {
    private $ac_id;
    private $user_id;
    private $ac_name;
    private $ac_type;
    private $ac_balance;

    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function insertData($data) {
        try {
            $this->user_id = $data['user_id'];
            $this->ac_name = $data['ac_name'];
            $this->ac_type = $data['ac_type'];
            $this->ac_balance = $data['ac_balance'];

            $query = "INSERT INTO Accounts (user_id, ac_name, ac_type, ac_balance) VALUES (:user_id, :ac_name, :ac_type, :ac_balance)";

            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':user_id', $this->user_id);
            $runQuery->bindParam(':ac_name', $this->ac_name);
            $runQuery->bindParam(':ac_type', $this->ac_type);
            $runQuery->bindParam(':ac_balance', $this->ac_balance);

            $result = $runQuery->execute();
            $this->updateNetWorth($this->user_id);

            return $result;
        } catch (Exception $e) {
            echo "Error: ".$e->getMessage();
            return false;
        }
    }

    private function updateNetWorth($user_id) {
        // Fetch the total balance of all accounts for the user
        $query = "SELECT SUM(ac_balance) as total_balance FROM Accounts WHERE user_id = :user_id";
        $runQuery = $this->db->prepare($query);
        $runQuery->bindParam(':user_id', $user_id);
        $runQuery->execute();
        $result = $runQuery->fetch();
    
        if ($result) {
            $totalBalance = $result['total_balance'];
    
            // Fetch the latest networth_month for the user
            $getLatestMonthQuery = "SELECT MAX(networth_month) as latest_month FROM networth WHERE user_id = :user_id";
            $getLatestMonthRun = $this->db->prepare($getLatestMonthQuery);
            $getLatestMonthRun->bindParam(':user_id', $user_id);
            $getLatestMonthRun->execute();
            $latestMonthResult = $getLatestMonthRun->fetch();
    
            if ($latestMonthResult) {
                $latestMonth = $latestMonthResult['latest_month'];
    
                // Update the last entry for the user in the networth table
                $updateNetWorthQuery = "UPDATE networth 
                                        SET amount = :amount
                                        WHERE user_id = :user_id 
                                        AND networth_month = :networth_month";
                $updateRun = $this->db->prepare($updateNetWorthQuery);
                $updateRun->bindParam(':user_id', $user_id);
                $updateRun->bindParam(':networth_month', $latestMonth);
                $updateRun->bindParam(':amount', $totalBalance);
                $updateRun->execute();
            }
        }
    }
    

    public function getData($id){
        try{
            $query = "SELECT * FROM Accounts WHERE user_id = :id";
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
    public function deleteData($id) { // pass the account ID
        try {
            // Fetch the user_id associated with the account being deleted
            $query = "SELECT user_id FROM Accounts WHERE ac_id = :ac_id";
            $fetchUserQuery = $this->db->prepare($query);
            $fetchUserQuery->bindParam(':ac_id', $id);
            $fetchUserQuery->execute();
            $userResult = $fetchUserQuery->fetch();
    
            if ($userResult) {
                $this->user_id = $userResult['user_id']; // Set the user_id
            } else {
                throw new Exception("No account found with the provided ID.");
            }
    
            // Delete the account
            $deleteQuery = "DELETE FROM Accounts WHERE ac_id = :ac_id";
            $runQuery = $this->db->prepare($deleteQuery);
            $runQuery->bindParam(':ac_id', $id);
            $runQuery->execute();
    
            $affectedRows = $runQuery->rowCount();
    
            // Update net worth for the user
            $this->updateNetWorth($this->user_id);
    
            return $affectedRows > 0;
        } catch (Exception $e) {
            error_log("Error deleting account: " . $e->getMessage()); // Use error_log for debugging
            return false;
        }
    }
    
}
?>
