<?php
class Transaction{
    private $id;
    private $user_id;
    private $ac_name;
    private $created_date;
    private $payee;
    private $category;
    private $outflow;
    private $inflow;
    private $cleared;

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function insertData($data){
        try{
            $this->id = $data['id'];
            $this->user_id = $data['user_id'];
            $this->ac_name = $data['ac_name'];
            $this->created_date = $data['created_date'];
            $this->payee = $data['payee'];
            $this->category = $data['category'];
            $this->outflow = $data['outflow'];
            $this->inflow = $data['inflow'];
            $this->cleared = $data['cleared'];

            $query = "INSERT INTO Transaction (id, user_id, ac_name, created_date, payee, category, outflow, inflow, cleared) VALUES (:id, :user_id, :ac_name, :created_date, :payee, :category, :outflow, :inflow, :cleared)";

            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':id', $this->id);
            $runQuery->bindParam(':user_id', $this->user_id);
            $runQuery->bindParam(':ac_name', $this->ac_name);
            $runQuery->bindParam(':created_date', $this->created_date);
            $runQuery->bindParam(':payee', $this->payee);
            $runQuery->bindParam(':category', $this->category);
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
    public function getData($id){ //pass the user id
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
    public function deleteData($id){ //pass the transaction id
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
}

?>