	function tutorial_render(environparams, highlightObjName)
	{
		if(false == asyncLoader.is_complete()) {return;}
		var transparent;
		if(is_border_loaded == 0)
		{		
			var loadedVal = load_grid_data();
			load_known_object(loadedVal);
			is_border_loaded = 1;
		}	

		for(var bindId = 0;bindId < vertexbuffer.length;bindId ++)
		{
			var highlight = false;
			bind_object_data(bindId);
			if(environparams.mouseDown == true)
			{
				locXArray[bindId] = get_new_posX(environparams);
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
								context3dStore.LINES,
								indicesCount[bindId],
								context3dStore.UNSIGNED_SHORT,
								0);								
			context3dStore.flush();
		}//bindId loop
	}
	/****************************************************************
	*
	*              INTERNAL IMPLEMENTATION
	*
	****************************************************************/
	var ygrid = [];
	var ygridindices = [];
	var ygridtexcoords = [];
	//per row points one side, so 40 points full row
	var numpoints = 20;
	function load_grid_data()
	{
		create_grid();
		return [ygrid, ygridindices, ygridtexcoords,
					"blue.png",
					0, //X,y,z
					0, //X,y,z
					0, //X,y,z
					"border", //name
					false //not video
					];
	}
	function create_grid()
	{
		//vertices for plane perpendicular to y axis
		for(z = -numpoints;z < numpoints;z ++)
		{
			for(x = -numpoints;x < numpoints;x ++)	
			{
				ygrid.push(x*0.5, -0.2, z*0.5);
				ygridtexcoords.push(x*0.5/numpoints, z*0.5/numpoints);
			}
		}
		//indices for plane - there will be points-1 indices for the lines
		for(z = 0;z < 2*numpoints-1;z ++)
		{
			for(x = 0;x < 2*numpoints-1;x ++)	
			{
				ygridindices.push(z*2*numpoints+x, (z+1)*2*numpoints+x);
				ygridindices.push((z+1)*2*numpoints+x, (z+1)*2*numpoints+x+1);
				ygridindices.push((z+1)*2*numpoints+x+1, z*2*numpoints+x+1);
				ygridindices.push(z*2*numpoints+x+1, z*2*numpoints+x);				
			}
		}
		//alert(ygridindices);
	}
	var is_border_loaded = 0;


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

	function update_eye(environparams, scale, bFollowMouse, bHighlight, 
				angleX, angleY, angleZ, locX, locY, locZ)
	{
		var matrix3 = new J3DIMatrix4(); //m.view matrix         
		var matrix1 = new J3DIMatrix4();	
	
		matrix3.makeIdentity();
		matrix1.makeIdentity();

		if(0)
		{
			matrix1.rotate(10, 1,0,0);
			matrix1.rotate(-2+2*locX, 0,1,0);	
		}
		else
		{
			matrix1.perspective(20, environparams.canvasWidth/environparams.canvasHeight, 1.5, 10000);

			matrix3.rotate(angleX + objParams.angleX, 1,0,0);
			matrix3.rotate(angleY + objParams.angleY, 0,1,0);
			matrix3.rotate(angleZ + objParams.angleZ, 0,0,1);
			
			matrix3.translate(locX+objParams.locX, locY + objParams.locY, locZ + objParams.locZ);		
			
			matrix3.scale(scale + objParams.scale, scale + objParams.scale, 1.0);	
			
			matrix1.lookat(
					0, 0.8, 8.5, //eye
					0, 0, 0, //center
					0, 10, 0); //up
			//projection * view
			matrix1.multiply(matrix3);		
		}		
				
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
				//context3dStore.LINEAR);
				context3dStore.LINEAR_MIPMAP_NEAREST);
		context3dStore.generateMipmap(context3dStore.TEXTURE_2D);				
		context3dStore.bindTexture(context3dStore.TEXTURE_2D, null);
	};	

		function bind_object_data(bindId)
	{
		if(false == asyncLoader.is_complete()) {return;}		
		/* Vertex buffer */
		context3dStore.bindBuffer(context3dStore.ARRAY_BUFFER, vertexbuffer[bindId]);
		context3dStore.bindAttribLocation(programObj, 0, "inVertex");
		context3dStore.enableVertexAttribArray(0);
		context3dStore.vertexAttribPointer(0, 3, context3dStore.FLOAT, context3dStore.FALSE, 0, 0);	
		/* Bind the index buffer */
		context3dStore.bindBuffer(context3dStore.ELEMENT_ARRAY_BUFFER, indexbuffer[bindId]);
		/* Texture buffer */
		context3dStore.bindBuffer(context3dStore.ARRAY_BUFFER, texcoordbuffer[bindId]);
		context3dStore.bindAttribLocation(programObj, 2, "inAppTexCoords");
		context3dStore.enableVertexAttribArray(2);
		context3dStore.vertexAttribPointer(2, 2, context3dStore.FLOAT, context3dStore.FALSE, 0, 0);	
		
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
		context3dStore.bindAttribLocation(programObj, 2, "inAppTexCoords");
		context3dStore.enableVertexAttribArray(2);
		context3dStore.vertexAttribPointer(2, 2, context3dStore.FLOAT, context3dStore.FALSE, 0, 0);	
		
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
	
	function get_new_posX(environparams)
	{
		return 1*(-1 + 2*environparams.mousePosX);
	}	