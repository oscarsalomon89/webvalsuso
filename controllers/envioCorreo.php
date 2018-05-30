<?php
require("../modulos/PHPMailer/class.phpmailer.php");
require("../modulos/PHPMailer/class.smtp.php");

$json = file_get_contents('php://input');
$obj = json_decode($json);

$name = $obj->name;
$email = $obj->remitente;
$men = $obj->mensaje;

// Datos de la cuenta de correo utilizada para enviar vía SMTP
$smtpHost = "usuario.ferozo.com";  // Dominio alternativo brindado en el email de alta 
$smtpUsuario = "sistemas@valsuso.com.ar";  // Mi cuenta de correo
$smtpClave = "miClave";  // Mi contraseña

$para      = 'oscar.salomon89@gmail.com,os_carp89@hotmail.com';
$titulo    = 'El título';
$mensaje   = $men;
$cabeceras = 'From: sistemas@valsuso.com.ar' . "\r\n" .
    'Reply-To: sistemas@valsuso.com.ar' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

echo mail($para, $titulo, $mensaje, $cabeceras);

////////////////seguir//////////////////////
// Datos de la cuenta de correo utilizada para enviar vía SMTP
$smtpHost = "usuario.ferozo.com";  // Dominio alternativo brindado en el email de alta 
$smtpUsuario = "miCuenta@miDominio.com";  // Mi cuenta de correo
$smtpClave = "miClave";  // Mi contraseña

// Email donde se enviaran los datos cargados en el formulario de contacto
$emailDestino = "correo_destinatario@suDominio.com";

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPAuth = true;
$mail->Port = 587; 
$mail->IsHTML(true); 
$mail->CharSet = "utf-8";

// VALORES A MODIFICAR //
$mail->Host = $smtpHost; 
$mail->Username = $smtpUsuario; 
$mail->Password = $smtpClave;

$mail->From = $email; // Email desde donde envío el correo.
$mail->FromName = $nombre;
$mail->AddAddress($emailDestino); // Esta es la dirección a donde enviamos los datos del formulario

$mail->Subject = "DonWeb - Ejemplo de formulario de contacto"; // Este es el titulo del email.
$mensajeHtml = nl2br($mensaje);
$mail->Body = "{$mensajeHtml} <br /><br />Formulario de ejemplo. By DonWeb<br />"; // Texto del email en formato HTML
$mail->AltBody = "{$mensaje} \n\n Formulario de ejemplo By DonWeb"; // Texto sin formato HTML
// FIN - VALORES A MODIFICAR //

$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

$estadoEnvio = $mail->Send(); 
if($estadoEnvio){
    echo "El correo fue enviado correctamente.";
} else {
    echo "Ocurrió un error inesperado.";
}