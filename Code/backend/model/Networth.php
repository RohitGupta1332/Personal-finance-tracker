<?php
class Networth{
    private $id;
    private $user_id;
    private $networth_date;
    private $amount;

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function addNetworth($data){
        try{
            $query = "INSERT INTO Networth (user_id, networth_month, amount) VALUES (:user_id, :networth_month, :amount)";
            $runInsert = $this->db->prepare($query);
            $runInsert->bindParam(':user_id', $data['user_id']);
            $runInsert->bindParam(':networth_month', $data['networth_month']);
            $runInsert->bindParam(':amount', $data['amount']);

            return $runInsert->execute();
        }
        catch(Exception $e){
            echo $e->getMessage();
        }
    }

    public function getNetworth($user_id){
        try{
            $query = "SELECT * FROM Networth WHERE user_id = :user_id";
            $runSelect = $this->db->prepare($query);
            $runSelect->bindParam(':user_id', $user_id);
            $runSelect->execute();

            return $runSelect->fetchAll();
        }
        catch(Exception $e){
            echo 'Error: ' . $e->getMessage();
            return null;
        }
    }
    
    public function getLastRecordedMonth($user_id) {
        try {
            $query = "SELECT networth_month FROM Networth WHERE user_id = :user_id ORDER BY networth_month DESC LIMIT 1";
            $runSelect = $this->db->prepare($query);
            $runSelect->bindParam(':user_id', $user_id);
            $runSelect->execute();
    
            $result = $runSelect->fetch(PDO::FETCH_ASSOC);
    
            if ($result) {
                return $result['networth_month'];
            } else {
                return null; 
            }
        } catch (Exception $e) {
            echo 'Error: ' . $e->getMessage();
            return null;
        }
    }
    
    
}

?>