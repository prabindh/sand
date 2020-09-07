<?php
$filename = $_POST["filename"];
$stringData = $_POST["data"];
if(strlen($stringData) > 200000) die("Too big data");
#Ensure we dont open new files
$filehandle = fopen($filename, 'r') or die("can't open file");
$filehandle = fopen($filename, 'w') or die("can't open file");
fwrite($filehandle, $stringData);
fclose($filehandle);
?>
