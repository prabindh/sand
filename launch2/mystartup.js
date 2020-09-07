var environParams={host:remotehost,editModeFlag:false,currViewId:0, glElement:null, absPosX:0,absPosY:0,mousePosX:0,mousePosY:0,whichkey:0,mouseDown:false, highlightObjName:"", highlightObjParentName:"", singleDraw:false};
var canvasElement;
function showDebugOutput(a)
{
}

function showInitMessage(a, err)
{
	var msgbox = document.getElementById("Target-Message-box");
	var parent = document.getElementById("Target-OpenGL-view");	
	msgbox.textContent = a;
	if(err === 0)
	{	
	parent.style.backgroundColor = "#222";	
		msgbox.style.backgroundColor = "#222"; 	
		msgbox.style.color = "#0094FF";
	}
	else
	{
		parent.style.backgroundColor = "red";
		msgbox.style.backgroundColor = "red"; 	
		msgbox.style.color = "white";
	}
}

function keyhandler(e) 
{	
	if(e.which) 	{environParams.whichkey = e.which;}	
	if(currScreenObject != null)
	{	currScreenObject.animate();}
} 

function mousemoveHandler(b)
{
	if(typeof canvasElement == "undefined") return;
	environParams.absPosX=b.pageX;environParams.absPosY=b.pageY;
	temp=(b.pageX-canvasElement.offsetLeft)/environParams.canvasWidth;
	if(temp>1){temp=1}environParams.mousePosX=temp;
	temp=(b.pageY-canvasElement.offsetTop)/environParams.canvasHeight;
	if(temp>1){temp=1}environParams.mousePosY=temp;
	
	if(currScreenObject != null)
		currScreenObject.animate();
}

function get_current_environs()
{
	return environParams;
}

function windowInit(a, editmode){

	canvasElement=document.getElementById(a);
	canvasElement.width = parseInt(getComputedStyle(canvasElement).width);
	canvasElement.height = parseInt(getComputedStyle(canvasElement).height);		

	try{glcontext=canvasElement.getContext("experimental-webgl",{antialias:true, preserveDrawingBuffer:true,alpha:true,premultipliedAlpha: false})}
		catch(b){showInitMessage("No 3d context",1);}

	if((typeof glcontext=="undefined")||(!glcontext)){showInitMessage("No WebGL detected. Try Chrome or Firefox.",1);
		return}
	else{showInitMessage("Click on a Lab ID, or Login.",0);}
	
	glcontext.viewport(0,0,canvasElement.width, canvasElement.height);	
		
	environParams.glElement = canvasElement;
	environParams.canvasWidth = canvasElement.width;
	environParams.canvasHeight = canvasElement.height;
	
	environParams.currViewId = 0; //Create view
	environParams.editModeFlag = editmode;
}