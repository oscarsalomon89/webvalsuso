<?php
$json = file_get_contents('php://input');
$obj = json_decode($json); 

$carpeta = $obj->carpeta;

$ruta = "../public/images/productos/".$carpeta."/"; // Indicar ruta
$filehandle = opendir($ruta); // Abrir archivos

while ($file = readdir($filehandle)) {
	if ($file != '.' && $file != '..') {
		echo $file;
		return;
	}	
}

