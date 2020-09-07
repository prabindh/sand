<?php

$tofilename = $_POST["tolab"];
$fromfilename = $_POST["fromid"];

if(stristr($tofilename,"default2") == TRUE) 
{
	die("Writing to default not allowed!");
}

$infile = @fopen($fromfilename."anim.xml", "r");
$outfile = @fopen($tofilename."anim.xml", "w");
$content = @fread($infile, filesize($fromfilename."anim.xml"));
@fwrite($outfile, $content);
@fclose($outfile);
@fclose($infile);

$infile = @fopen($fromfilename."frag.shader", "r");
$outfile = @fopen($tofilename."frag.shader", "w");
$content = @fread($infile, filesize($fromfilename."frag.shader"));
@fwrite($outfile, $content);
@fclose($outfile);
@fclose($infile);

$infile = @fopen($fromfilename."setup_render.js", "r");
$outfile = @fopen($tofilename."setup_render.js", "w");
$content = @fread($infile, filesize($fromfilename."setup_render.js"));
@fwrite($outfile, $content);
@fclose($outfile);
@fclose($infile);

$infile = @fopen($fromfilename."setup_core.js", "r");
$outfile = @fopen($tofilename."setup_core.js", "w");
$content = @fread($infile, filesize($fromfilename."setup_core.js"));
@fwrite($outfile, $content);
@fclose($outfile);
@fclose($infile);

$infile = @fopen($fromfilename."tile.xml", "r");
$outfile = @fopen($tofilename."tile.xml", "w");
$content = @fread($infile, filesize($fromfilename."tile.xml"));
@fwrite($outfile, $content);
@fclose($outfile);
@fclose($infile);

$infile = @fopen($fromfilename."vertex.shader", "r");
$outfile = @fopen($tofilename."vertex.shader", "w");
$content = @fread($infile, filesize($fromfilename."vertex.shader"));
@fwrite($outfile, $content);
@fclose($outfile);
@fclose($infile);


?>
