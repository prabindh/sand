var backgroundObjTexCoords = [
0.000000, 0.000000,  1.000000, 0.000000,  1.000000, 1.000000,
0.000000, 1.000000, 0.000000, 1.000000, 0.000000, 1.000000
];

function tutorialObj(context3d, x, y, program, objectParams)
{
	vertexbuffer = [];	
	context3dStore = context3d;
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


	programObj = program;
	var alphaLoc;
	var highlightLoc;
	var currDrawMode = 0; //Non-wireframe triangles
	bSingleDraw = false;

	asyncLoader = new WORKER_object_loader();
	asyncLoader.init(loadBytesToGL, environParams.host);

	this.type="screenobject";

	objParams = objectParams;
	this.params = objParams;
		
	//Retrieve and bind object data - textures, buffers
	this.load_object_data = function()
	{
		var ret = [false];

		if(check_known_object(objParams.type))
		{		
			var loadedVal = load_known_object_data(objParams);			
			ret = load_known_object(loadedVal);
		}
		else
		{
			ret = load_unknown_blob();
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
	this.show_selected_object_only = function()
	{
		bSingleDraw = true;
	}
	this.clearSingleDraw = function(name)
	{
		bSingleDraw = false;
	}		
	
	this.updateScale = function(deltaScale, componentName)
	{
		var id = getIdFromName(componentName);
		if(id >= 0) scaleArray[id] += deltaScale;
		else if(componentName == objParams.name) objParams.scale += deltaScale;
	}

	this.ioctl = function(cmd, args)
	{
		if(cmd == 0)
			currDrawMode = args;
	}
	this.exit = function()
	{
	}
	
	//Update/Animate
	this.render = tutorial_render;

	function get_new_posY(environparams)
	{
		return 1*(1 - 2*environparams.mousePosY);
	}
	
function load_known_object_data(object)
{
	if(object.type == "GL-axis")
	{
		return [[0,0,0, 0.9,0,0, 0,0,0, 0,0.5,0, 0,0,-20, 0,0,2.5], [0,1, 2,3, 4,5], backgroundObjTexCoords,
					"white.png",
					object.locX, //X,y,z
					object.locY, //X,y,z
					object.locZ, //X,y,z
					object.name, //name
					false //not video
					];
	}	
}

function load_unknown_blob()
{
	var parsedBlobName = retrieve_blob_data(objParams.name);
	if(parsedBlobName == null)
	{	
		//alert("Could not find matching blob data");
		return [false, objParams.name, null];
	}
	var parsedBlobVal = parseOBJfile(parsedBlobName);

	for(var i = 0; i < parsedBlobVal.length; i ++)
	{
		vertexArray = new Float32Array(parsedBlobVal[i].vertices);
		indexArray = new Uint16Array(parsedBlobVal[i].indices);
		texCoordArray = new Float32Array(parsedBlobVal[i].finaluv);

		// Material.007_hp_base.png_hp_base.png.001
		//Material_name.PNG
		var textureName = "../images/yellow.png";
		if(parsedBlobVal[i].mtl.split("Material_").length > 1) //Try default first
		{
			textureName = "../images/" + parsedBlobVal[i].mtl.split("Material_")[1];
		}				
		if(parsedBlobVal[i].mtl.split(".").length > 2) //TODO: Clean up some models that do not have minimum one texture
		{
			textureName = "../images/" + parsedBlobVal[i].mtl.split(".")[1].slice(4) + 
					"." + parsedBlobVal[i].mtl.split(".")[2].slice(0,3);
		}
		// Material.026_churchwall_32pix..001
		if(parsedBlobVal[i].mtl.split("..").length > 1)
		{
			textureName = "../images/yellow.png";
		}	
		var loadedVal = [];
		loadedVal.push(
				vertexArray, 
				indexArray, 
				texCoordArray, 
					textureName,
					0,0,0,
					parsedBlobVal[i].name, //name
					false //not video
					);
		load_known_object(loadedVal);
	}
	return [true, objParams.name, blobModuleNameArray];
}
function check_known_object(object)
{
	if(object == "tutorial") return true;	
	if(object == "points") return true;
	if(object == "GL-axis") return true;	
	return false;
}	

function retrieve_blob_data(objectName)
{
	if(objectName == "robotarm") return robotarm;
	else return null;
};

	
	/************************ END OF INTERNAL IMPLEMENTATION *************************/
};
