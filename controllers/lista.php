<?php
$ruta= 'files/'; 

$filehandle = opendir($ruta); // Abrir archivos

while ($file = readdir($filehandle)) {
	if ($file != '.' && $file != '..') {
		echo $file;
		return;
	}	
}