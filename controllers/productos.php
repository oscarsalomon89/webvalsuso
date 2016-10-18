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

$rows=array();
$sql = "SELECT * FROM productos"; 
$result = $mysqli->query($sql);  

while($row = $result->fetch_array(MYSQLI_ASSOC)){
        $rows[]=$row;
    }

//$row = mysql_fetch_object($rec);
$json = json_encode($rows);
echo $json;