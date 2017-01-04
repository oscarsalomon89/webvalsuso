<?php
$mysqli = new mysqli("localhost","root","lbdt14","webvalsuso");

if ($mysqli->connect_errno) {
    printf("Falló la conexión: %s\n", $mysqli->connect_error);
    exit();
}

$data = array();
$data['success'] = false;
$codigo = $_POST['codigo'];

// Miramos que efectivamente sea un imagen
$size = getimagesize($_FILES['photo']['tmp_name']);
$ruta = "../public/images/productos/".$codigo."/";

if($size) {
	if($_FILES['photo']['type'] == 'image/jpeg' || 
	   $_FILES['photo']['type'] == 'image/jpg') {
		// Es una imagen, la guardamos cogiendo los datos de la key 'photo' de $_FILES
		if(!is_dir($ruta)){
			mkdir($ruta, 0777);
		}else{
			$filehandle = opendir($ruta); // Abrir archivos

			while ($arch = readdir($filehandle)) {
				if ($arch != '.' && $arch != '..') {
					unlink($ruta.$arch);
				}	
			}
		}

		$extension = end(explode('/',$_FILES['photo']['type']) ); 
		$file = $_FILES['photo']['name'].'.'.$extension;

		if($file && move_uploaded_file($_FILES["photo"]["tmp_name"],$ruta.$file)){
			// Todo ha ido bien, devolvemos la ubicación de la imagen.
			// Marcamos la respuesta como buena
			$sqlBus = "SELECT codigoProducto FROM imagenes WHERE codigoProducto = '$codigo'";

			$resultado = $mysqli->query($sqlBus);

			if (mysqli_num_rows($resultado)<=0){
				$sql = "insert into imagenes(codigoProducto,existe)
							values('$codigo',1)";

				$result = $mysqli->query($sql);
				if (!$result)
					echo $sql.'<br>';
				}
			$data['success'] = true;
			$data['msg'] = 'La foto se subio correctamente';
		} else {
			// Error transfiriendo la imagen a la ubicación
			$data['msg'] = 'Error en la ubicacion del archivo';
			}
	} else {
		// No se trata de una imagen habitual
		$data['msg'] = 'Extension no permitida';
	}
 
} else {
	// No es una imagen
	$data['msg'] = 'Tipo de formato no valido';
}
echo json_encode($data);