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
	function load_known_object(loadedVal)
	{	
		vertexArray = new Float32Array(loadedVal[0]);
		indexArray = new Uint16Array(loadedVal[1]);
		texCoordArray = new Float32Array(loadedVal[2]);

		indicesCount.push(indexArray.length);

		textureName = loadedVal[3];
		bVideoFlag = loadedVal[8];

		//Only async texture loading is triggered, textureLoadCount should be 0 before actual usage in render_tile
		if(bVideoFlag == false)
			load_bind_object_texture(textureName);
		else
			load_bind_video_texture(videoElement);

		//Create and add buffers to list
		//TODO - unify all objects
		vertexbuffer.push(context3dStore.createBuffer());
		/* Vertex data */
		context3dStore.bindBuffer(context3dStore.ARRAY_BUFFER, vertexbuffer[vertexbuffer.length-1]);
		context3dStore.bufferData(context3dStore.ARRAY_BUFFER, vertexArray, context3dStore.DYNAMIC_DRAW);
		context3dStore.bindAttribLocation(programObj, 0, "inVertex");
		context3dStore.enableVertexAttribArray(0);
		context3dStore.vertexAttribPointer(0, 3, context3dStore.FLOAT, context3dStore.FALSE, 0, 0);	

		/* Step 2 - Generate triangle set using indices into VBO */
		/* NOTE - Indices are Uint16, not float */
		/* Load index data - note usage of ELEMENT_ARRAY_BUFFER */
		indexbuffer.push(context3dStore.createBuffer());
		context3dStore.bindBuffer(context3dStore.ELEMENT_ARRAY_BUFFER, indexbuffer[indexbuffer.length-1]);			
		context3dStore.bufferData(context3dStore.ELEMENT_ARRAY_BUFFER, indexArray,context3dStore.DYNAMIC_DRAW);

		/* Now load textures */
		texcoordbuffer.push(context3dStore.createBuffer());
		context3dStore.bindBuffer(context3dStore.ARRAY_BUFFER, texcoordbuffer[texcoordbuffer.length-1]);
		context3dStore.bufferData(context3dStore.ARRAY_BUFFER, texCoordArray,context3dStore.DYNAMIC_DRAW);
		context3dStore.bindAttribLocation(programObj, 1, "inAppTexCoords");
		context3dStore.enableVertexAttribArray(1);
		context3dStore.vertexAttribPointer(1, 2, context3dStore.FLOAT, context3dStore.FALSE, 0, 0);	
		
		//load rendering parameters for this module
		locXArray.push(0);
		locYArray.push(0);
		locZArray.push(0);
		angleXArray.push(0);
		angleYArray.push(0);
		angleZArray.push(0);
		scaleArray.push(0);
		blobModuleNameArray.push(loadedVal[7]); //name
		
		return [true, objParams.name, blobModuleNameArray];
	}

	/****************************************************************
	*
	*              INTERNAL IMPLEMENTATION
	*
	****************************************************************/	
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

	programObj = program;
	var alphaLoc;
	var highlightLoc;
	currDrawMode = 0; //Non-wireframe triangles
	bSingleDraw = false;

	objParams = objectParams;
	
	asyncLoader = new WORKER_object_loader();
	asyncLoader.init(loadBytesToGL, environParams.host);	
	//Retrieve and bind object data - textures, buffers
	this.load_object_data = function()
	{
		var ret = false;
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
	function load_bind_object_texture(mtlname)
	{
		var mtlname1 = "../images/" + mtlname;
		//create new textureobject
		currTextureObj.push(context3dStore.createTexture());
		//load name of texture, or default name
		asyncLoader.post_transaction(mtlname1, currTextureObj[currTextureObj.length-1], 1, 0, ""); //binary object		
	}

	function load_bind_video_texture(videoElementName)
	{
		//create new textureobject
		currTextureObj.push(context3dStore.createTexture());
		//Load video synchronously - assumed that video has finished atleast initialising
		loadBytesToGL(videoElementName, currTextureObj[currTextureObj.length-1]);
	}

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
		if(object.type == "tutorial") 
		{
			return [flatbuttonObj, backgroundObjIndices, backgroundObjTexCoords,
						"car1.png",
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
		return false;
	}	

	function retrieve_blob_data(objectName)
	{
		if(objectName == "robotarm") return robotarm;
		if(objectName == "robotarm1") return robotarm;	
		else return null;
	};	
	/************************ END OF INTERNAL IMPLEMENTATION *************************/	
};
