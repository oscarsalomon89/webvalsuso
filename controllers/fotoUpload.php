<?php
$mysqli = new mysqli("localhost","root","lbdt14","webvalsuso");

if ($mysqli->connect_errno) {
    printf("Falló la conexión: %s\n", $mysqli->connect_error);
    exit();
}

$codigo = $_POST["codigo"];
$file = $_FILES["file"]["name"];
$extension = end(explode('.',$file) ); 

if ($extension == "png" || $extension == "jpeg" || $extension == "jpg"){
	$dir = "../public/images/productos/".$codigo."/";
	$nombreNuevo = $codigo.'.'.$extension;

	if(!is_dir($dir))
		mkdir($dir, 0777);
	if($file && move_uploaded_file($_FILES["file"]["tmp_name"], $dir.$nombreNuevo)){
		//Archivo Subido
		$sql = "update productos SET imagen = '".$nombreNuevo.
				"' WHERE codigo = '".$codigo."'";

		$result = $mysqli->query($sql);
		if (!$result)
			echo $sql.'<br>';

		echo 'exito';
	}
}else{
	echo 'extencion';
}

