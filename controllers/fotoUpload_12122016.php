<?php
$mysqli = new mysqli("localhost","c0270343_valsuso","N7lq3eo14","c0270343_valsuso");

if ($mysqli->connect_errno) {
    printf("Falló la conexión: %s\n", $mysqli->connect_error);
    exit();
}

$codigo = $_POST["codigo"];
$file = $_FILES["file"]["name"];
$extension = end(explode('.',$file) ); 

if ($extension == "png" || $extension == "jpeg" || $extension == "jpg"){
	$dir = "../public/images/productos/".$codigo."/";

	if(!is_dir($dir)){
		mkdir($dir, 0777);
	}else{
		$ruta = "../public/images/productos/".$codigo."/"; // Indicar ruta
		$filehandle = opendir($ruta); // Abrir archivos

		while ($arch = readdir($filehandle)) {
			if ($arch != '.' && $arch != '..') {
				unlink($ruta.$arch);
			}	
		}
	}
		
	if($file && move_uploaded_file($_FILES["file"]["tmp_name"], $dir.$file)){
		//Archivo Subido
		$sqlBus = "SELECT codigoProducto FROM imagenes WHERE codigoProducto = '$codigo'";

		$resultado = $mysqli->query($sqlBus);

		if (mysqli_num_rows($resultado)<=0){
			$sql = "insert into imagenes(codigoProducto,existe)
						values('$codigo',1)";

			$result = $mysqli->query($sql);
			if (!$result)
				echo $sql.'<br>';
			}		

		echo 'exito';
	}
}else{
	echo 'extencion';
}