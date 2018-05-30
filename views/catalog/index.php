<?php
session_start();
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
  require('../../modulos/barcode/index.php');
 
  $mysqli = new mysqli("localhost","root","lbdt14","webvalsuso");
 
 if ($mysqli->connect_errno) {
     printf("Falló la conexión: %s\n", $mysqli->connect_error);
     exit();
 }
 
 $rows=array();
 $sql = "SELECT * FROM imagenes 
             INNER JOIN productos ON codigoProducto = id where existe = 1";
              
 $result = $mysqli->query($sql); 

 $ruta = "../../public/images/productos/"; // Indicar ruta

class CatalogoPDF extends PDF_Code128{

//Cabecera de pagina
function Header(){
    //Cargo el objeto denuncia   

    global $cant_pag;

    $this->SetFont('Arial','B',10);
    
    //Color Blanco
    $this->SetTextColor(0);
    //Movernos a la derecha
    $this->Image('../../public/images/logo.png',10,10,30);
    $this->SetXY(48,10);
    
    //T�tulo
    $this->Cell(151,4,utf8_decode('VALSUSO S.R.L'),0,1,'R');
    $this->setLeftMargin(48);
    $this->Cell(151,6,utf8_decode('Hidráulica y Repuestos para el agro'),0,1,'R');
    $this->SetFont('Arial','',8);    
    $this->Cell(151,3,utf8_decode('Alberdi 1544 | 2400 | San Francisco | Córdoba'),0,1,'R');
    $this->Cell(151,3,utf8_decode('Teléfono (03564) 479078 / 479520'),0,1,'R');
    $this->Cell(151,3,utf8_decode('valsusorepuestos@gmail.com | valsusosrl@gmail.com'),0,1,'R');
    $this->SetXY(135,15);

    $this->setLeftMargin(10);
    //Salto de l�nea
    $this->Ln(10);
    //Obtengo la cantidad total de paginas
    $cant_pag ++;
}

//Pie de p�gina
function Footer(){
    //Posicion: a 1,5 cm del final
    $this->SetXY(10,289);
    $this->SetFont('Arial','B',9);
    $this->Cell(190,5,utf8_decode('VALSUSO S.R.L - HIDRAULICA Y REPUESTOS PARA EL AGRO  |  Página: ').$this->PageNo(),0,0,'C');
    }
}

ob_end_clean();

$pdf = new CatalogoPDF();
$pdf->AliasNbPages();
//$pdf->SetAutoPageBreak(true, 35);
$pdf->AddPage();
$pdf->setLeftMargin(10);

$pdf->SetY(31);
//$pdf->Rect(15,60,180,180);
$pdf->SetFillColor(130); 
$pdf->SetTextColor(255); //Blanco
$pdf->SetFont('Arial','B',12);
$pdf->Cell(190,10,utf8_decode('CATALOGO DE PRODUCTOS'),0,1,'C',true);

$pdf->SetTextColor(0); //negro
$key=1;
$i=0;
$maxWidth = 35;
$maxHeight = 30;
$pdf->SetY($pdf->GetY()-2);
//For de productos con imagenes
while($row = $result->fetch_array(MYSQLI_ASSOC)){
//for ($i=0; $i < 50; $i++) {    
    $pdf->SetFont('Arial','B',9);
    $title = $row['descripcion'];
    $xImg = 10;
    $yImg = $pdf->GetY();
    if($i%2 == 0){
        $yImg = $yImg+2;
        $pdf->SetXY(35,$yImg + 1);
        $pdf->Cell(69, 5, utf8_decode(strtoupper($title)), 0, 0, 'R');
        $pdf->SetY($yImg);
    }else {
        $pdf->SetXY(130,$yImg + 1);
        $xImg = 105;        
        $pdf->Cell(69, 5, utf8_decode(strtoupper($title)), 0, 1, 'R');
        $pdf->SetY($yImg + 33);
    }

    ///////////////////////
    if($row['codigoProducto'] != null){
        $rutaPicture = $ruta.$row['codigoProducto'].'/';

        $filehandle = opendir($rutaPicture); // Abrir archivos
        
        while ($file = readdir($filehandle)) {
            if ($file != '.' && $file != '..') {
                $rutaFin = $file;
            }	
        }

        ////tamaño imagen
        list($width, $height) = getimagesize($rutaPicture.$rutaFin);
        
        if(($maxWidth / $width) < ($maxHeight / $height)) {
            //El ancho es mayor que el alto
            $y2 = 0;
            $x2 = $maxWidth;
        } else {
            $x2 = 0;
            $y2 = $maxHeight;
        }
        //Fin calculo    
        $rutaFinal = $rutaPicture.$rutaFin;
        //Fin muestra imagen
    }else{
        $rutaFinal = "../../public/images/iconos/vistaPrevia.png";
        $x2 = 0;
        $y2 = 29;
    }
    //////////////////////

    $pdf->Image($rutaFinal, $xImg+1, $yImg+5,$x2,$y2);
    //$pdf->SetX(35);
    $xanterior = $pdf->GetX();
    $yanterior = $pdf->GetY();
    $pdf->Rect($xImg, $yImg, 95, 35);

    $pdf->SetXY($xImg + 45, $yImg + 7);
    //$pdf->Text($xImg + 50, $yImg+10,'hola');
    $pdf->SetFillColor(130);
    $pdf->SetTextColor(255); //Blanco
    $pdf->SetFont('Arial', 'B', 11);
    $pdf->Cell(50, 5, utf8_decode('Cod.: '.$row['codigo']), 0, 1, 'L', true);

    $pdf->SetTextColor(0); //negro    
    $pdf->SetFillColor(0);
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->SetX($xImg + 45);
    $pdf->SetFont('Arial', '', 10);

    $code=$row['codigo'];
    $pdf->Code128($xImg+46,$yImg+16,$code,35,8);
    //$pdf->Write($xImg+45,$code);
    
    $pdf->SetX($xImg + 45);

    $pdf->SetXY($xanterior, $yanterior);
    //$pdf->Cell(50, 5, utf8_decode('precio: '), 1, 0, 'C');
    if($key == 14){
        $key = 0;
        $pdf->AddPage();
        $pdf->SetY(31);
        //$pdf->Rect(15,60,180,180);
        $pdf->SetFillColor(130); 
        $pdf->SetTextColor(255); //Blanco
        $pdf->SetFont('Arial','B',12);
        $pdf->Cell(190,10,utf8_decode('CATALOGO DE PRODUCTOS'),0,1,'C',true);
        $pdf->SetY($pdf->GetY()-2);
        $pdf->SetTextColor(0); //negro
    }
    $key++;
    $i++;
    //$pdf->Cell(95, 32, '', 1, 0, 'C');
    //$pdf->Cell(95, 32, '', 0, 1, 'C');    
}


$pdf->Output();
    
?>