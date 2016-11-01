<?php
require_once('../modulos/Classes/PHPExcel.php');
require_once('../modulos/Classes/PHPExcel/Reader/Excel5.php');
//require_once('../modulos/Classes/PHPExcel/Reader/Excel2007.php');

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
	//$objReader = new PHPExcel_Reader_Excel2007();
	$objReader = PHPExcel_IOFactory::createReader('Excel5');
	$objPHPExcel = $objReader->load('files/'.$file);

	$objFecha = new PHPExcel_Shared_Date();
	// Asignar hoja de excel activa

	$objPHPExcel->setActiveSheetIndex(0);
	$rows=$objPHPExcel->getActiveSheet()->getHighestRow();//cantidad de filas
	
	for ($i=2;$i<=$rows;$i++){
		set_time_limit(20);
		$codigoProd = $objPHPExcel->getActiveSheet()->getCell('B'.$i)->getCalculatedValue();
		$description = $objPHPExcel->getActiveSheet()->getCell('C'.$i)->getCalculatedValue();
		if($codigoProd != '' && $description != ''){
			$id = $objPHPExcel->getActiveSheet()->getCell('A'.$i)->getCalculatedValue();
			$precioSinPunto = str_replace('.',"",$objPHPExcel->getActiveSheet()->getCell('D'.$i)->getCalculatedValue());
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

	//inicio csv
	/*$handle = fopen('files/'.$file, "r");
	while (($data = fgetcsv($handle,1000,";")) !== FALSE){	 
	//verificamos que la información no sean los nombre de las columnas.
		if($data[3] != "Precio"){
			//mandamos a guardar en la base de datos. tabla productos.
			$codigoProd = utf8_decode($data[1]);
			$description = utf8_decode($data[2]);

			if($codigoProd != '' && $description != ''){
				$id = $data[0];
				$precioSinPunto = str_replace('.',"",$data[3]);			
				$precio = str_replace(',',".",$precioSinPunto);
				$desc = str_replace("'","''",$description);
				//inserta en la tabla
				$sql = "insert into productos (id,codigo,descripcion,precio)";
				$sql .= " values('$id','$codigoProd','$desc','$precio')";
				$result = $mysqli->query($sql);
				if (!$result){ 
					echo $sql.'<br>';
					}
				}			
			}
		}*/
	//}
	//cerramos la lectura del archivo "abrir archivo" con un "cerrar archivo"
	//fclose($handle);
	//Fin csv
	echo 'exito';
}