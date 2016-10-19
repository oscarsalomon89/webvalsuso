<?php
require_once('../modulos/Classes/PHPExcel.php');
require_once('../modulos/Classes/PHPExcel/Reader/Excel2007.php');

$mysqli = new mysqli("localhost","root","lbdt14","webvalsuso");

if ($mysqli->connect_errno) {
    printf("Falló la conexión: %s\n", $mysqli->connect_error);
    exit();
}

$file = $_FILES["file"]["name"];
if(!is_dir("files/"))
	mkdir("files/", 0777);
if($file && move_uploaded_file($_FILES["file"]["tmp_name"], "files/".$file)){
	//php excel
	$objReader = new PHPExcel_Reader_Excel2007();
	$objPHPExcel = $objReader->load('files/'.$file);

	$objFecha = new PHPExcel_Shared_Date();
	// Asignar hoja de excel activa

	$objPHPExcel->setActiveSheetIndex(0);
	$rows=$objPHPExcel->getActiveSheet()->getHighestRow();//cantidad de filas

	for ($i=1;$i<=$rows;$i++){
		$_DATOS_EXCEL[$i]['codigo'] = $objPHPExcel->getActiveSheet()->getCell('A'.$i)->getCalculatedValue();
		$_DATOS_EXCEL[$i]['descripcion'] = $objPHPExcel->getActiveSheet()->getCell('B'.$i)->getCalculatedValue();
		$_DATOS_EXCEL[$i]['precio']= $objPHPExcel->getActiveSheet()->getCell('C'.$i)->getCalculatedValue();
	}

	foreach($_DATOS_EXCEL as $campo => $valor){
		$cod = $valor['codigo'];
		$desc = $valor['descripcion'];
		$precio = $valor['precio'];
		$sql = "insert into productos (id,codigo,descripcion,precio)";
		$sql .= " values($campo,'$cod','$desc','$precio')";
		$result = $mysqli->query($sql);
		if (!$result){ 
			echo 'Error al insertar registro'.$campo;}
		}

	//inicio csv
	/*$handle = fopen('files/'.$file, "r");
	while (($data = fgetcsv($handle,1000,";")) !== FALSE){	 
	//verificamos que la información no sean los nombre de las columnas.
		if(strtoupper($data[0]) != "NOMBRES"){
		//Insertamos los datos con los valores...
		$sql = "insert into productos (codigo,descripcion,precio)";
		$sql .= " values('$data[0]','$data[1]','$data[2]')";
		$result = $mysqli->query($sql);
		//mandamos a guardar en la base de datos. tabla productos.
		}
	}*/
	//cerramos la lectura del archivo "abrir archivo" con un "cerrar archivo"
	//fclose($handle);
	//Fin csv
	echo 'exito';
}