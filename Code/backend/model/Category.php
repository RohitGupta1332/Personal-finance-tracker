<?php
class Category{
    private $category_id;
    private $user_id;
    private $category_type;
    private $category_name;

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function getTotalCategoryWise($user_id, $date){
       try{
            $query = 'SELECT 
                        c.category_type, 
                        SUM(t.outflow) AS total_spending
                        FROM 
                            `transaction` t
                        JOIN 
                            `category` c ON t.category_id = c.category_id
                        WHERE 
                            t.user_id = :user_id  
                        AND DATE_FORMAT(t.created_date, '%Y-%m') = :date
                            GROUP BY 
                        c.category_type
                        ORDER BY 
                        total_spending DESC';
        
            $runQuery = $this->db->prepare($query);

            $runQuery->bindParam(':user_id', $user_id);
            $runQuery->bindParam(':user_id', $date);
            $runQuery->execute();

            return $runQuery->fetchAll();
        }
        catch(Exception $e){
            echo 'Error: ' . $e->getMessage();
            return null;
        }
    }
}

?>