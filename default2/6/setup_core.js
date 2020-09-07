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
	this.render = function(environparams, highlightObjName)
	{	
		if(false == asyncLoader.is_complete()) {return;}
		var transparent;
	
		for(var bindId = 0;bindId < vertexbuffer.length;bindId ++)
		{
			var highlight = false;
			if((highlightObjName == blobModuleNameArray[bindId]) ||
				(highlightObjName == objParams.name)) //if whole obj is selected
			{
				highlight = true;
			}
			/**
			hl = false single = false, DRAW
			hl = true single = false, DRAW
			hl = false single = true, DONT DRAW
			hl = true single = true, DRAW
			*/
			if(highlight == false && bSingleDraw == true)
				transparent = true;
			else
				transparent = false;
			if(0)
			{
				if(transparent == true)
				{
					//globalAlpha
					alphaLoc =  context3dStore.getUniformLocation(programObj,"globalAlpha");
					context3dStore.uniform1f(alphaLoc, 0.1);
					context3dStore.enable (context3dStore.BLEND );
					context3dStore.blendFunc ( context3dStore.SRC_ALPHA, context3dStore.ONE );
				}
				else
				{
					context3dStore.disable (context3dStore.BLEND );
				}
			}//
			if(transparent == true) continue;
	
			bind_object_data(bindId);
			if(highlight == true && environparams.mouseDown == true)
			{
				locXArray[bindId] = get_new_posX(environparams);
				locYArray[bindId] = get_new_posY(environparams);
			}
			update_eye(environparams, scaleArray[bindId],
				((highlight == true && environparams.mouseDown == true)), 
				highlight, 
				angleXArray[bindId],
				angleYArray[bindId],
				angleZArray[bindId],
				locXArray[bindId], 
				locYArray[bindId],
				locZArray[bindId]);
			context3dStore.drawElements(
								(currDrawMode == 0) ? context3dStore.TRIANGLES: context3dStore.LINE_STRIP,
								indicesCount[bindId],
								context3dStore.UNSIGNED_SHORT,
								0);								
			context3dStore.flush();
		}//bindId loop
	}

	function update_eye(environparams, scale, bFollowMouse, bHighlight, 
				angleX, angleY, angleZ, locX, locY, locZ)
	{
		matrix3.makeIdentity();
		matrix1.makeIdentity();

		matrix1.perspective(20, environparams.canvasWidth/environparams.canvasHeight, .5, 10000);

		matrix3.rotate(angleX + objParams.angleX, 1,0,0);
		matrix3.rotate(angleY + objParams.angleY, 0,1,0);
		matrix3.rotate(angleZ + objParams.angleZ, 0,0,1);
		
		matrix3.translate(locX+objParams.locX, locY + objParams.locY, locZ + objParams.locZ);		
		
		matrix3.scale(scale + objParams.scale, scale + objParams.scale, 1.0);	
		
		matrix1.lookat(
				0, 0.8, -8.5, //eye
				0, 0, 0, //center
				0, 10, 0); //up			

		//projection * view
		matrix1.multiply(matrix3);

		var matrixLoc =  context3dStore.getUniformLocation(programObj,"MVPMatrix");
		context3dStore.uniformMatrix4fv(matrixLoc,
			  false, new Float32Array(matrix1.getAsArray()) );	
	}
	function loadBytesToGL(currImage, currTexture)
	{
		context3dStore.bindTexture(context3dStore.TEXTURE_2D, currTexture);
		/* TODO - understand standard image storage in memory */
		context3dStore.pixelStorei(context3dStore.UNPACK_FLIP_Y_WEBGL, true);
		context3dStore.texImage2D(context3dStore.TEXTURE_2D, 
				0, 
				context3dStore.RGBA, 
				context3dStore.RGBA, 
				context3dStore.UNSIGNED_BYTE,
				currImage);
		//var err = context3dStore.getError();
		//alert(err);
		context3dStore.texParameteri(context3dStore.TEXTURE_2D, 
				context3dStore.TEXTURE_MAG_FILTER, 
				//context3dStore.NEAREST);
				context3dStore.LINEAR);
		context3dStore.texParameteri(context3dStore.TEXTURE_2D,
				context3dStore.TEXTURE_MIN_FILTER,
				//context3dStore.NEAREST);
				context3dStore.LINEAR);
				//context3dStore.LINEAR_MIPMAP_NEAREST);
		context3dStore.generateMipmap(context3dStore.TEXTURE_2D);				
		context3dStore.bindTexture(context3dStore.TEXTURE_2D, null);
	};	

	function bind_object_data(bindId)
	{
		if(false == asyncLoader.is_complete()) {return;}		
		/* Vertex buffer */
		context3dStore.bindBuffer(context3dStore.ARRAY_BUFFER, vertexbuffer[bindId]);
		context3dStore.bindAttribLocation(program, 0, "inVertex");
		context3dStore.enableVertexAttribArray(0);
		context3dStore.vertexAttribPointer(0, 3, context3dStore.FLOAT, context3dStore.FALSE, 0, 0);	
		/* Bind the index buffer */
		context3dStore.bindBuffer(context3dStore.ELEMENT_ARRAY_BUFFER, indexbuffer[bindId]);
		/* Texture buffer */
		context3dStore.bindBuffer(context3dStore.ARRAY_BUFFER, texcoordbuffer[bindId]);
		context3dStore.bindAttribLocation(program, 1, "inAppTexCoords");
		context3dStore.enableVertexAttribArray(1);
		context3dStore.vertexAttribPointer(1, 2, context3dStore.FLOAT, context3dStore.FALSE, 0, 0);	
		
		context3dStore.bindTexture(context3dStore.TEXTURE_2D, currTextureObj[bindId]);
	}
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
	var context3dStore = context3d;
	var vertexbuffer = [];
	var indexbuffer = [];
	var texcoordbuffer = [];
	var indicesCount = [];
	var currTextureObj = [];
	var locXArray = [];
	var locYArray = [];
	var locZArray = [];
	var scaleArray = [];
	var angleXArray = [];
	var angleYArray = [];
	var angleZArray = [];	
	var blobModuleNameArray = [];
	var highlightIdArray = [];

	var programObj = program;
	var alphaLoc;
	var highlightLoc;
	var currDrawMode = 0; //Non-wireframe triangles
	var bSingleDraw = false;

	var matrix3 = new J3DIMatrix4(); //m.view matrix         
	var matrix1 = new J3DIMatrix4();	
	var objParams = objectParams;
	
	var asyncLoader = new WORKER_object_loader();
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
