<?php
$mysqli = new mysqli("localhost","root","lbdt14","webvalsuso");

if ($mysqli->connect_errno) {
    printf("Falló la conexión: %s\n", $mysqli->connect_error);
    exit();
}

$file = $_FILES["file"]["name"];
if(!is_dir("files/"))
	mkdir("files/", 0777);
if($file && move_uploaded_file($_FILES["file"]["tmp_name"], "files/".$file)){

	$handle = fopen('files/'.$file, "r");
	while (($data = fgetcsv($handle,1000,";")) !== FALSE){	 
	//verificamos que la información no sean los nombre de las columnas.
		if(strtoupper($data[0]) != "NOMBRES"){
		//Insertamos los datos con los valores...
		$sql = "insert into productos (codigo,descripcion,precio)";
		$sql .= " values('$data[0]','$data[1]','$data[2]')";
		$result = $mysqli->query($sql);
		//mandamos a guardar en la base de datos. tabla productos.
		}
	}
	//cerramos la lectura del archivo "abrir archivo" con un "cerrar archivo"
	fclose($handle);
	echo 'exito';
}