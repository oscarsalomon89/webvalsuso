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

$filtro = $obj->auth;
$where = '';
$orderBy = '';

if($filtro == 2){
	$tipo = $obj->tipo;
	$parte = $obj->parte;
	$val = $obj->valor;
	$orden = $obj->campoOrden;
	$tipoOrden = $obj->tipoOrden;

	$where = ' WHERE ';
	
	if($tipo == 1){
		$where .= "codigo like '%".$val."'";
	}else{
		if($parte == 0){
			//no esta tildado buscar en cualquier parte
			$cond = "like '".$val."%'";
		}else{
			$cond = "like '%".$val."%'";
		}

		$where .= "descripcion ".$cond;
	}

	if($orden != ''){
		$orderBy = ' order by '.$orden.' '.$tipoOrden;
	}
}

$rows=array();
$sql = "SELECT * FROM productos 
			LEFT JOIN imagenes ON id = codigoProducto"
			.$where.$orderBy; 
			
$result = $mysqli->query($sql);  

while($row = $result->fetch_array(MYSQLI_ASSOC)){
        $rows[]=$row;
    }

//$row = mysql_fetch_object($rec);
$json = json_encode($rows);
echo $json;