var backgroundObj = [
-1,-1, -1,
1,-1,-1,
1,1,-1,
-1,1,-1
];

var backgroundObjTexCoords = [
0.000000, 0.000000,  1.000000, 0.000000,  1.000000, 1.000000,
0.000000, 1.000000
];

var backgroundObjIndices = [
0,1,2,
0,2,3
];

var flatbuttonObj = [
-1, -1, 0,
1, -1, 0,
1, 1, 0,
-1, 1, 0,
];

function tutorialObj(context3d, x, y, program, objectParams)
{
	this.type="screenobject";

	this.params = objectParams;

	this.updateX = function(deltaX, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) locXArray[id] += deltaX;
		else if(componentName == objParams.name) objParams.locX += deltaX;
		
	}
	this.updateY = function(deltaY, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) locYArray[id] += deltaY;
		else if(componentName == objParams.name) objParams.locY += deltaY;
	}
	this.updateZ = function(deltaZ, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) locZArray[id] += deltaZ;
		else if(componentName == objParams.name) objParams.locZ += deltaZ;		
	}
	this.updateZAngle = function(deltaAngle, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) angleZArray[id] += deltaAngle;
		else if(componentName == objParams.name) objParams.angleZ += deltaAngle;
	}	
	this.updateYAngle = function(deltaAngle, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) angleYArray[id] += deltaAngle;
		else if(componentName == objParams.name) objParams.angleY += deltaAngle;
	}		
	this.updateXAngle = function(deltaAngle, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) angleXArray[id] += deltaAngle;
		else if(componentName == objParams.name) objParams.angleX += deltaAngle;
	}			
	this.updateScale = function(deltaScale, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) scaleArray[id] += deltaScale;
		else if(componentName == objParams.name) objParams.scale += deltaScale;
	}


	//Update/Animate
	this.render = tutorial_render;		
	function get_new_posX(environparams)
	{
		return 1*(-1 + 2*environparams.mousePosX);
	}
	function get_new_posY(environparams)
	{
		return 1*(1 - 2*environparams.mousePosY);
	}
function load_known_object_data(object)
{
	if(object.type == "points")
	{
		for(var i = 0;i < 5500;i ++)
		{
			points.push(2*Math.random()-1, 2*Math.random()-1, -2*Math.random());
			pointIndices.push(i);
		}

		return [points, pointIndices, points,
					"white.png",
					object.locX, //X,y,z
					object.locY, //X,y,z
					object.locZ, //X,y,z
					object.name, //name
					false //not video
					];
	}
}


function check_known_object(object)
{
	if(object == "tutorial") return true;	
	if(object == "points") return true;
	return false;
}	


	context3dStore = context3d;
	vertexbuffer = [];
	indexbuffer = [];
	texcoordbuffer = [];
	indicesCount = [];
	currTextureObj = [];
	locXArray = [];
	locYArray = [];
	locZArray = [];
	scaleArray = [];
	angleXArray = [];
	angleYArray = [];
	angleZArray = [];	
	blobModuleNameArray = [];
	highlightIdArray = [];

        var points = [];
        var pointIndices = [];


	programObj = program;
	var alphaLoc;
	var highlightLoc;
	bSingleDraw = false;
        var currDrawMode = 0;

	asyncLoader = new WORKER_object_loader();
	asyncLoader.init(loadBytesToGL, environParams.host);
	objParams = objectParams;	
	//Retrieve and bind object data - textures, buffers
	this.load_object_data = function()
	{
		var ret = false;
		if(check_known_object(objParams.type))
		{		
			var loadedVal = load_known_object_data(objParams);
			ret = load_known_object(loadedVal);
		}

		return ret;
	}

	this.getCurrParams = function()
	{
		return [objParams.locX, objParams.locY, objParams.locZ, objParams.scale];
	}
	
	function getIdFromName(name)
	{
		for(var i = 0;i < blobModuleNameArray.length;i ++)
			if(blobModuleNameArray[i] == name) return i;
		return -1;
	}
	this.show_selected_object_only = function()
	{
		bSingleDraw = true;
	}
	this.clearSingleDraw = function(name)
	{
		bSingleDraw = false;
	}		
	

	this.ioctl = function(cmd, args)
	{
		if(cmd == 0)
			currDrawMode = args;
	}
	this.exit = function()
	{
	}

	


	
	/************************ END OF INTERNAL IMPLEMENTATION *************************/
};
