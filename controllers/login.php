<?php
include_once("../views/clientes/login/conexion.php");
session_start();
$json = file_get_contents('php://input');
$obj = json_decode($json);

switch ($obj->auth) {
    case 1:
        $name = $obj->name;
        $password = $obj->password;
        $cliente = array();

        $sql = "SELECT * FROM clientes WHERE name = '$name'"; 
        $rec = mysql_query($sql);
        $row = mysql_fetch_object($rec);
        if($row){       
            if(password_verify($password,$row->password)){
                $_SESSION['rol']   = $row->rol;
                $_SESSION['userid'] = $row->id;
                $json = json_encode($row);
                echo $json;
            }else{
                echo 'contraseña incorrecta';
            }
        }else{
            echo 'usuario inexistente';
        }       
        break;
    case 2:
        session_destroy();
        echo true;
        break;
    default:
        if(!isset($_SESSION['userid'])){ 
            echo 'login'; 
        } else {
            if(isset($_SESSION['rol']) && $_SESSION['rol'] == 1){ 
                echo 'usuarios'; //admin
            }else{
                echo 'clientes';
            }             
        }
        break;
}


?>