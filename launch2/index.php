<html>
<head>
<META NAME="Author" CONTENT="Prabindh Sundareson, prabindh@gpupowered.org">
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
<script type='text/javascript' src='../utils/myCanvasMatrix.js'></script>
<script src="../utils/myJ3DI.js" type="text/javascript"> </script>
<script src="../utils/myJ3DIMath.js" type="text/javascript"> </script>
<script src="worker_object_loader.js" type="text/javascript"> </script>

<script src="programs.js" type="text/javascript"> </script>
<script src="vyuha.js" type="text/javascript"> </script>
<script src="screen.js" type="text/javascript"> </script>
<script src="package.js" type="text/javascript"> </script>
<script src="glslobj.js" type="text/javascript"> </script>
<script src="../utils/three.js" type="text/javascript"></script>

<?php
/* Check for my-tutorials */
$localuse = false;
if ($localuse ==false)
{
  define('DRUPAL_ROOT', '/home/gpupower/public_html/');
  chdir('/home/gpupower/public_html/');
  include_once('./includes/bootstrap.inc');
  drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
  global $user;

  if ($user->uid) {
    $expectedname = './sand2/'.$user->name; 
    $username = $user->name;
  }
  else
  {
    $expectedname = './sand2/default2';
    $username = 'default2';
  }
}
else{
  /* for local tests - change manually the username here*/
  $username = 'default2'; #'prabindh'; #
  $expectedname = '../'.$username; 
}

$userfoldersnum = 0;

  if (is_dir($expectedname)) {
    $userfolders = scandir($expectedname);
    if($userfolders != FALSE) 
    {
      $userfoldersnum=count($userfolders) - 2;//remove . and ..
    }
  }
  if($userfoldersnum <= 0) //no folders exist - error - create new
  {
    mkdir($expectedname, 0777);
    for($filecount = 1; $filecount <= 1; $filecount ++)
    {
      $tempfoldername = $expectedname.'/'.$filecount;
      if(mkdir($tempfoldername, 0777) === TRUE)
      {
        $tempfp = @fopen($tempfoldername.'/setup_render.js', "w");
        if($tempfp !== FALSE) @fclose($tempfp);
        $tempfp = @fopen($tempfoldername.'/setup_core.js', "w");
        if($tempfp !== FALSE) @fclose($tempfp);		
        $tempfp = @fopen($tempfoldername.'/frag.shader', "w");
        if($tempfp !== FALSE) @fclose($tempfp);
        $tempfp = @fopen($tempfoldername.'/vertex.shader', "w");
        if($tempfp !== FALSE) @fclose($tempfp);
        $tempfp = @fopen($tempfoldername.'/tile.xml', "w");
        if($tempfp !== FALSE) @fclose($tempfp);	
        $tempfp = @fopen($tempfoldername.'/anim.xml', "w");
        if($tempfp !== FALSE) @fclose($tempfp);
      }//mkdir
    }
  }

echo "<script type='text/javascript' src='../utils/objdata.js'></script>";

echo '<title>GPUPowered.Org Tutorials [@'.$username.'] </title>';
echo "<script type='text/javascript'>".'var currUserName="'.$username.'";</script>';  
echo "<script type='text/javascript'>".'var remotehost="http://'.$_SERVER['SERVER_NAME'].'/sand2/launch2/"'."</script>";
?>

<script type='text/javascript' src='myruntuts.js'></script>
<script type='text/javascript' src='mystartup.js'></script>

<script src="../utils/ace-builds-master/src-min/ace.js" type="text/javascript" charset="utf-8"></script>

<link rel="stylesheet" type="text/css" href="sandtheme.css" />
</head>

<body onload="windowInit('Target-3d-canvas', false)"   onkeydown="keyhandler(event)" onmousemove="mousemoveHandler(event)" onmousedown="mousedownHandler(event)" onmouseup="mouseupHandler(event)">
<br>

<div id="Target-Message-box"></div>
<div id="Target-loading-icon"></div>
<div id="Target-quiz">
</div>
<div id="second-row-activity">

<div id="Target-Editor-view" style="display:none"></div>
<div id="Target-Editor-Control-view" style="display:none">
<a href="#" onClick="editor_save()"><img src="../images/save.svg" width="100%" height="15%" onmouseover="iconhelper(6)"></a><br>
<a href="#" onClick="editor_cancel()"><img src="../images/cancel.svg" width="100%" height="15%" onmouseover="iconhelper(7)"></a><br>
</div>


<div id="Target-OpenGL-view" onmouseover="iconhelper(8)">
<canvas id="Target-3d-canvas"></canvas>
</div>

<div id="Target-Scene-controller">
<a href="#" onClick="editor(0)"><img src="../images/drawing.svg" width="100%" height="15%" onmouseover="iconhelper(0)"></a>
<a href="#" onClick="editor(1)"><img src="../images/fragment.svg" width="100%" height="15%" onmouseover="iconhelper(1)"></a>
<a href="#" onClick="editor(2)"><img src="../images/render.svg" width="100%" height="15%" onmouseover="iconhelper(2)"></a><br><br>

<a href="#" onClick="editor(3)"><img src="../images/wireframe.svg" width="100%" height="15%" onmouseover="iconhelper(3)"></a>
<a href="#" onClick="editor(4)"><img src="../images/non-wireframe.svg" width="100%" height="15%" onmouseover="iconhelper(4)"></a><br><br>

<a href="#" onClick="editor(5)"><img src="../images/clone.svg" width="100%" height="15%" onmouseover="iconhelper(5)"></a>

<!-- <a href="#" onClick="replay()">Run again</a><br> -->
</div>

</div>

<div id="third-row-activity">
<div id="previous-screen">
</div>
<div id="Target-Template-view">
<?php if($username !== "default2") echo '<div id="My-Target-Template" onClick="locate(1, true)"><a href="#">1</a></div>'; ?>

<div id="Target-Template" onClick="locate(1, false)"><a href="#">1</a></div>
<div id="Target-Template" onClick="locate(2, false)"><a href="#">2</a></div>
<div id="Target-Template" onClick="locate(3, false)"><a href="#">3</a></div>
<div id="Target-Template" onClick="locate(4, false)"><a href="#">4</a></div>
<div id="Target-Template" onClick="locate(5, false)"><a href="#">5</a></div>
<div id="Target-Template" onClick="locate(6, false)"><a href="#">6</a></div>
<div id="Target-Template" onClick="locate(7, false)"><a href="#">7</a></div>
<div id="Target-Template" onClick="locate(8, false)"><a href="#">8</a></div>
<div id="Target-Template" onClick="locate(9, false)"><a href="#">9</a></div>
<div id="Target-Template" onClick="locate('L7', false)"><a href="#">L1</a></div>
<div id="Target-Template" onClick="locate('L1', false)"><a href="#">L2</a></div>
<div id="Target-Template" onClick="locate('L3', false)"><a href="#">L3</a></div>
<div id="Target-Template" onClick="locate('L2', false)"><a href="#">L4</a></div>
<div id="Target-Template" onClick="locate('L6', false)"><a href="#">L5</a></div>
<div id="Target-Template" onClick="locate('L4', false)"><a href="#">L6</a></div>
<div id="Target-Template" onClick="locate('L5', false)"><a href="#">L7</a></div>
<div id="Target-Template" onClick="window.open('http://www.gpupowered.org/node/32')"><a href="#">Q</a></div>

</div>
<div id="next-screen">
</div>
</div>

<div id="fourth-row-activity">
<!-- <a href="https://github.com/prabindh/gpupowered.gl">tworker, vyuh</a> -->
<a href="http://www.gpupowered.org">[Home]</a>
<a href="http://www.slideshare.net/prabindh/gfx2014-labs">[Lab Manual]</a>
</div>

<br>

</body>
</html>