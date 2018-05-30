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
        $recordar = $obj->recordar;
        $cliente = array();

        $sql = "SELECT * FROM clientes WHERE name = '$name'"; 
        $result = $mysqli->query($sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);

        if($row){       
            if(password_verify($password,$row['password'])){
                if($recordar == true){
                    setcookie("id_user",$row["id"], time()+(60*60*24*365));
                    setcookie("password",$password, time()+(60*60*24*365));
                }
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
        unset($_COOKIE["id_user"]);
        setcookie('id_user','', time() - 1000);
        setcookie('password','', time() - 1000);
        echo true;
        break;
    default:
        if(!isset($_SESSION['userid'])){
            if(isset($_COOKIE['id_user']) && isset($_COOKIE['password']) && 
                $_COOKIE['id_user'] !="" && $_COOKIE['password'] !=""){
                    $sql = "SELECT rol,password FROM clientes WHERE id = '".
                            $_COOKIE["id_user"]."'"; 
                    $result = $mysqli->query($sql);
                    $row = $result->fetch_array(MYSQLI_ASSOC);

                    if($row){
                        if(password_verify($_COOKIE["password"],$row['password'])){
                            if($row['rol'] == 1){ 
                                echo 'admin'; //admin//usuarios
                            }else{
                                echo 'usuarios';
                            }
                        }                    
                    }else{
                        echo 'clientes'; 
                    }
            }else 
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