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
        $name = $obj->name;
        $password = $obj->password;
        $cliente = array();

        $sql = "SELECT * FROM clientes WHERE name = '$name'"; 
        $result = $mysqli->query($sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);

        if($row){       
            if(password_verify($password,$row['password'])){
                $_SESSION['rol']   = $row['rol'];
                $_SESSION['userid'] = $row['id'];
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
            echo 'clientes'; 
        } else {
            if(isset($_SESSION['rol']) && $_SESSION['rol'] == 1){ 
                echo 'admin'; //admin//usuarios
            }else{
                echo 'usuarios';
            }             
        }
        break;
}


?>