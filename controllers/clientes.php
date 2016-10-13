<?php
include_once("../views/clientes/login/conexion.php");
session_start();
$json = file_get_contents('php://input');
$obj = json_decode($json);

$mysqli = new mysqli("localhost","root","lbdt14","webvalsuso");

if ($mysqli->connect_errno) {
    printf("Falló la conexión: %s\n", $mysqli->connect_error);
    exit();
}

switch ($obj->auth) {
    case 1:       
        //obtiene todos los clientes 
        $rows=array();
        $sql = "SELECT * FROM clientes"; 
        $result = $mysqli->query($sql);  

        while($row = $result->fetch_array(MYSQLI_ASSOC)){
                $rows[]=$row;
            }

        //$row = mysql_fetch_object($rec);
        $json = json_encode($rows);
        echo $json;
        break;
    case 2:
        $name = $obj->name;
        //$password = $obj->password;
        $password = password_hash($obj->password,PASSWORD_DEFAULT);
        $sql="insert into clientes(name,password,rol)values('$name','$password',2)";
        $result = $mysqli->query($sql);
        echo $result;
        break;
    case 3:
        $id = $obj->id;
        $sql = "SELECT * FROM clientes WHERE id = '$id'"; 
        $result = $mysqli->query($sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        
        $json = json_encode($row);
        echo $json;
        break;
    default:
        if(!isset($_SESSION['userid'])){ 
            echo 'login'; 
        } else {
            if(isset($_SESSION['name']) && $_SESSION['name'] == 'admin'){ 
                echo 'admin'; 
            }else{
                echo 'clientes';
            }             
        }
        break;
}


?>