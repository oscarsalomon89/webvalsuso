<?php
require("../modulos/PHPMailer/class.phpmailer.php");
$json = file_get_contents('php://input');
$obj = json_decode($json);

$name = $obj->name;
$remitente = $obj->remitente;
$men = $obj->mensaje;

$para      = 'oscar.salomon89@gmail.com,os_carp89@hotmail.com';
$titulo    = 'El título';
$mensaje   = $men;
$cabeceras = 'From: sistemas@valsuso.com.ar' . "\r\n" .
    'Reply-To: sistemas@valsuso.com.ar' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

echo mail($para, $titulo, $mensaje, $cabeceras);