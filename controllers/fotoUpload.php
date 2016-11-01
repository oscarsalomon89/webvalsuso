<?php

$codigo = 51031;
$file = $_FILES["file"]["name"];

$dir = "../public/images/productos/".$codigo."/";
if(!is_dir($dir))
	mkdir($dir, 0777);
if($file && move_uploaded_file($_FILES["file"]["tmp_name"], $dir.$file)){
	//Archivo Subido
	echo 'exito';
}