<?php
class Accounts {
    private $ac_id;
    private $user_id;
    private $ac_name;
    private $ac_type;
    private $ac_balance;

    private $db;
    private $table_name;

    public function __construct($db) {
        $this->db = $db;
        $this->table_name = "Accounts";
    }

    public function create($data) {
        try {
            $this->ac_id = $data['ac_id'];
            $this->user_id = $data['user_id'];
            $this->ac_name = $data['ac_name'];
            $this->ac_type = $data['ac_type'];
            $this->ac_balance = $data['ac_balance'];

            $query = "INSERT INTO $this->table_name (ac_id, user_id, ac_name, ac_type, ac_balance) VALUES (:ac_id, :user_id, :ac_name, :ac_type, :ac_balance)";

            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':ac_id', $this->ac_id);
            $runQuery->bindParam(':user_id', $this->user_id);
            $runQuery->bindParam(':ac_name', $this->ac_name);
            $runQuery->bindParam(':ac_type', $this->ac_type);
            $runQuery->bindParam(':ac_balance', $this->ac_balance);

            $result = $runQuery->execute();
            return $result;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }
}
?>
