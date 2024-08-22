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
            return $result;
        } catch (Exception $e) {
            echo "Error: ".$e->getMessage();
            return false;
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
    public function deleteData($id){ //pass the transaction id
        try{
            $query = "DELETE FROM Accounts WHERE ac_id = :ac_id";
            $runQuery = $this->db->prepare($query);
            $runQuery->bindParam(':ac_id', $id);
            $runQuery->execute();

            $affectedRows = $runQuery->rowCount();

            return $affectedRows > 0;
        }
        catch(Exception $e){
            echo "Error: ".$e->getMessage(); //replace every error message with error_log()
            return false;
        }
    }
}
?>
