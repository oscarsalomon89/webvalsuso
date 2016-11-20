<?php
require_once('../modulos/Classes/ExcelReader/Excel/reader.php');

$mysqli = new mysqli("localhost","root","lbdt14","webvalsuso");

if ($mysqli->connect_errno) {
    printf("Falló la conexión: %s\n", $mysqli->connect_error);
    exit();
}

$file = $_FILES["file"]["name"];
if(!is_dir("files/"))
	mkdir("files/", 0777);
if($file && move_uploaded_file($_FILES["file"]["tmp_name"], "files/".$file)){

	ini_set('max_execution_time', 300); //300 seconds = 5 minutes
	$data = new Spreadsheet_Excel_Reader();
	$data->setOutputEncoding('CP1251');
	$data->read('files/'.$file);
	error_reporting(E_ALL ^ E_NOTICE);
	//$data->sheets[0]['cells'][3][1];//Lee celda A3 [fila][columna]
	$rows = $data->sheets[0]['numRows'];	
	for ($i=2;$i<=$rows;$i++){		
		$codigoProd = $data->sheets[0]['cells'][$i][2];
		$description = $data->sheets[0]['cells'][$i][3];
		if($codigoProd != '' && $description != ''){
			$id = $data->sheets[0]['cells'][$i][1];
			$precioSinPunto = str_replace('.',"",$data->sheets[0]['cells'][$i][4]);
			$precio = str_replace(',',".",$precioSinPunto);
			$desc = str_replace("'","''",$description);
			//inserta en la tabla
			$sql = "insert into productos (id,codigo,descripcion,precio)";
			$sql .= " values('$id','$codigoProd','$desc','$precio')";
			$result = $mysqli->query($sql);
			if (!$result){ 
				echo $sql.'<br>';}
			}		
	}
	echo 'exito';
}