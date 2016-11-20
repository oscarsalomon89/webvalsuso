<?php
$json = file_get_contents('php://input');
$obj = json_decode($json);

$name = $obj->name;
$remitente = $obj->remitente;
$men = $obj->mensaje;

$para      = 'oscar.salomon89@gmail.com';
$titulo    = 'Mensaje Web de: '.$name;
$mensaje   = wordwrap($men, 70, "\r\n");

$resultado = mail($para, $titulo, $mensaje);

echo $resultado;