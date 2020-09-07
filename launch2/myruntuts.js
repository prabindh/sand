var glcontext = null;

var currVertexshaderstring = "";
var currFragshaderstring = "";
var currSetup_corestring = "";
var currSetup_renderstring = "";
var currTilestring = "";
var currAnimstring = "";
var currEditId = -1;
var currTutorial = -1;

function loadme(c, custom)
{
	var name;
	if(custom == false) name = "default2";
	else name = currUserName;
	
	packageloader = new packageLoader();
	var loading_info = document.getElementById("Target-loading-icon");
	loading_info.style.display = "block";
	packageloader.load(name, c, executeTutorial);
}

var vyuh = new Vyuh();
var currScreenObject = null;
var timeLineArray = [];
		
function initialiseScreen(vertexshaderstring, fragshaderstring, tilestring, animstring)
{
	//Now create the screens and add it to selector
	var newScreen = new screen(vyuh);
	var ret = newScreen.setup(glcontext, vertexshaderstring, fragshaderstring, tilestring, animstring);
	if(ret[0] == false) showDebugOutput("ERROR:screen setup failed!");
	else
	{
		currScreenObject = newScreen;
		if(newScreen.animate) {newScreen.animate();showDebugOutput("STATUS:Tutorial #" + currTutorial + " loaded.");}
	}
}


function executeTutorial(vertexshaderstring, fragshaderstring, setup_corestring, setup_renderstring, tilestring, animstring){
	if(setup_corestring == "" && setup_renderstring == "")
	{
		showDebugOutput("ERROR:Setup files not found or invalid data!");
		return;
	}
	var loading_info = document.getElementById("Target-loading-icon");
	loading_info.style.display = "none";	

	var oldscript = document.getElementById("downloaded-tutorial-core");
	if(oldscript) document.getElementsByTagName("head")[0].removeChild(oldscript);
	oldscript = document.getElementById("downloaded-tutorial-render");
	if(oldscript) document.getElementsByTagName("head")[0].removeChild(oldscript);
	
	var tempscriptval = document.createElement("script");
	tempscriptval.type = "text/javascript";
	tempscriptval.id = "downloaded-tutorial-core";	
	tempscriptval.textContent = setup_corestring;
	document.getElementsByTagName("head")[0].appendChild(tempscriptval);
	
	tempscriptval = document.createElement("script");
	tempscriptval.type = "text/javascript";
	tempscriptval.id = "downloaded-tutorial-render";
	tempscriptval.textContent = setup_renderstring;
	document.getElementsByTagName("head")[0].appendChild(tempscriptval);

	currVertexshaderstring = vertexshaderstring;
	currFragshaderstring = fragshaderstring;
	currSetup_corestring = setup_corestring;
	currSetup_renderstring = setup_renderstring;	
	currTilestring = tilestring;
	currAnimstring = animstring;

	var ret = initialiseScreen(vertexshaderstring, fragshaderstring, tilestring, animstring);
	vyuh.animateStart();
}


function replay()
{
	if(currScreenObject) vyuh.animateStart();
}


var animationMode = false;
function toggleAnimation(id, my)
{
	animationMode = !animationMode;
	if(animationMode == true) //reversed state!
		vyuh.animateStart();
	else
		vyuh.animateStop();
};

var allTimeLines = [];
function attach_timeline(ok)
{
	var elem = document.getElementById("timeline-selector");
	elem.style.display="none";
	if(ok == true)
	{
		var x=document.getElementsByName("timeline-action")[0];
		var animationType = x.options[x.selectedIndex].value;
		var times = document.getElementsByName('timeline-times')[0].value;
		var every = document.getElementsByName('timeline-every')[0].value;
		var starttime =document.getElementsByName('timeline-start')[0].value; 
		var endtime = document.getElementsByName('timeline-stop')[0].value;
		
		var timeLine = new TimeLine(environParams.highlightObjName, environParams.highlightObj, animationType, starttime, endtime, times/every);
		vyuh.addTimeline(timeLine);
	}
	environParams.currViewId = 0;
}

function show_timeline(screenobj, highlight, highlightParent)
{
	var elem = document.getElementById("timeline-selector");
	elem.style.display="block";
	environParams.currViewId = 3;
}

function object_properties(id)
{
	if(id == 2) currScreenObject.scale_object(environParams.highlightObjName, environParams.highlightObjParentName, 0.1);
	if(id == 3) currScreenObject.scale_object(environParams.highlightObjName, environParams.highlightObjParentName, -0.1);
	if(id == 4) currScreenObject.rotate_object(environParams.highlightObjName, environParams.highlightObjParentName, 1);
	if(id == 5) currScreenObject.show_selected_object(environParams.highlightObjName, environParams.highlightObjParentName);
	if(id == 6) currScreenObject.show_all_objects();
	
	if(id == 8) show_timeline(currScreenObject, environParams.highlightObjName, environParams.highlightObjParentName);

};

function mousedownHandler(event)
{
	environParams.mouseDown = true;
}
function mouseupHandler(event)
{
	environParams.mouseDown = false;
}


function select_object(object)
{
	//For Selection based
	//environParams.highlightObjNum = object.options[object.selectedIndex].value;
	//For li based
	update_selected_object(object.target);
}
function update_selected_object(object)
{
	environParams.highlightObjName = object.selfName;
	environParams.highlightObjParentName = object.parent;
	environParams.highlightObj = object.object;
	if(environParams.highlightObj.type == "screen")
		currScreenObject = environParams.highlightObj;
}

function loadShaderString(id)
{
    var element = document.getElementById(id);
    var curr = element.firstChild;
    if (!element || !curr)
	{
      return null;
    }
    var currStr = "";
	while (curr)
	{
		currStr += curr.textContent;
		curr = curr.nextSibling;
    }
	return currStr;
}

//Utility functions
function create_ladder(parentname, subname, type, object)
{
	var ah = document.createElement("a");
	ah.href="#";
	var li = document.createElement(type);
	li.selfName = subname;
	li.parent = parentname;
	li.object = object;
	li.appendChild(document.createTextNode(subname));
	li.addEventListener("click", select_object, false);
	ah.appendChild(li);
	return [ah, li];
}
function load_to_li(parentname, subnames, object)
{
	//insert into object tree for selection
	var objTree = document.getElementById("scene-list");
	var li1 = create_ladder(parentname, parentname, "ul", object);
	objTree.appendChild(li1[0]);
	for(var i = 0;i < subnames.length;i ++)
	{
		if(parentname == subnames[i]) continue;
		var li2 = create_ladder(parentname, subnames[i], "li", object);
		li1[0].appendChild(li2[1]);
	}
	return li1;
}

function set_viewer_mode_selected_object(name)
{
	environParams.highlightObjName = environParams.highlightObjParentName = name;
}

var quizshown = false;
function showquiz()
{
	var quiz = document.getElementById("Target-quiz");
	if(quizshown == true)
	{
		quiz.style.display="none";
		quizshown = false;
	}
	else
	{
		quiz.style.display="block";
		quizshown = true;
	}
}
function locate(elem, custom)
{
	if(!glcontext) {showDebugOutput("No GL Context!");return;}
	if(currScreenObject != null) 
	{
		currScreenObject.clear();
		currScreenObject = null;
	}
	currTutorial = elem;	
	loadme(elem, custom);
}


function editor(id)
{
    var editor = ace.edit("Target-Editor-view");
    editor.setTheme("ace/theme/monokai");
    editor.setFontSize(16);
    editor.getSession().setMode("ace/mode/glsl");

	if(id < 3)
	{
		var editorview = document.getElementById("Target-Editor-view");
		editorview.style.display="block";	
		editorview = document.getElementById("Target-Editor-Control-view");
		editorview.style.display="block";
		var glview = document.getElementById("Target-OpenGL-view");
		glview.style.display="none";	
		if(id == 0)
			editor.setValue(currVertexshaderstring);
		else if(id == 1)
			editor.setValue(currFragshaderstring);
		else if(id == 2)
			editor.setValue(currSetup_renderstring);

		currEditId = id;

	}
	else if(id == 3)
	{
		if(currScreenObject) currScreenObject.set_wireframe_mode(1);
	}
	else if(id == 4)
	{
		if(currScreenObject) currScreenObject.set_wireframe_mode(0);
	}
	else if(id == 5) 
	{
		//send command to server to clone to lab
		if(currTutorial != -1)
		{
			if(currUserName == "default2") 
			{
				showDebugOutput("ERROR: Default user not allowed to clone!");
				return;
			}
			packagecopier = new packageCopier();
			packagecopier.copy(currUserName, currTutorial, null);
		}
	}	
}


function editor_save(id)
{
	var editorview = document.getElementById("Target-Editor-view");
	var controlview = document.getElementById("Target-Editor-Control-view");
    var editor = ace.edit("Target-Editor-view");
	var loading_info = document.getElementById("Target-loading-icon");	

	loading_info.style.display = "block";	
	if(currUserName == "default2") showDebugOutput("ERROR: Default user not allowed to save changes!");
	else if((currUserName != "default2")&&(currTutorial != 1)) showDebugOutput("ERROR: User cannot save this lab!");
	else
	{
		packagesaver = new packageSaver();

		if(currEditId == 0)
			currVertexshaderstring = editor.getValue();
		else if(currEditId == 1)
			currFragshaderstring = editor.getValue();
		else if(currEditId == 2)
			currSetup_renderstring = editor.getValue();
		if(currTutorial != -1)
			packagesaver.save(currUserName, currTutorial, 
				currVertexshaderstring, currFragshaderstring, 
				currSetup_renderstring, currTilestring, currAnimstring, save_complete);
	}
	editorview.style.display="none";
	controlview.style.display="none";

	var glview = document.getElementById("Target-OpenGL-view");
	glview.style.display="block";	
}

function save_complete()
{
	var loading_info = document.getElementById("Target-loading-icon");	
	loading_info.style.display = "none";
}

function editor_cancel()
{
	var editorview = document.getElementById("Target-Editor-view");
	var controlview = document.getElementById("Target-Editor-Control-view");
 	editorview.style.display="none";
	controlview.style.display="none";

	var glview = document.getElementById("Target-OpenGL-view");
	glview.style.display="block";	
	
    var editor = ace.edit("Target-Editor-view");
	editor.setValue("");
}
function iconhelper(id)
{
	if(id == 0)
	{
			showInitMessage("Edit Vertex shader code by clicking here", 0);
	}
	else if(id == 1)
	{
			showInitMessage("Edit Fragment shader code by clicking here", 0);
	}
	else if(id == 2)
	{
			showInitMessage("Edit Rendering code by clicking here", 0);
	}
	else if(id == 3)
	{
			showInitMessage("Switch to Wire-frame mode by clicking here", 0);
	}	
	else if(id == 4)
	{
			showInitMessage("Switch to Non-Wire-frame mode by clicking here", 0);
	}		
	else if(id == 5)
	{
			showInitMessage("Clone this demo to Personal lab (needs login)", 0);
	}		
	else if(id == 6)
	{
			showInitMessage("Save edits and return to lab", 0);
	}		
	else if(id == 7)
	{
			showInitMessage("Cancel edits and return to lab", 0);
	}		
	else if(id == 8)
	{
			showInitMessage("Click on a Lab ID, or Login", 0);
	}		

}