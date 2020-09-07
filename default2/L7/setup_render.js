	var currColorL7 = 0.0;
	function tutorial_render(environparams, highlightObjName)
	{	
		currColorL7 += 0.1;
		if(currColorL7 > 0.9) currColorL7 = 0.0;
		context3dStore.viewport(0,0,128, 128);
		context3dStore.clearColor(0., currColorL7, currColorL7/2, 1.);

		context3dStore.enable (context3dStore.BLEND );
		context3dStore.blendFunc ( context3dStore.SRC_ALPHA, context3dStore.ONE );		

		context3dStore.clear(context3dStore.COLOR_BUFFER_BIT|context3dStore.DEPTH_BUFFER_BIT);
		
		context3dStore.flush();
	}
	
	function load_bind_object_texture(mtlname)
	{
	}

	function load_bind_video_texture(videoElementName)
	{
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
		context3dStore.bindAttribLocation(programObj, 1, "inAppTexCoords");
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

		blobModuleNameArray.push(loadedVal[7]); //name
		
		return [true, objParams.name, blobModuleNameArray];
	}	
	
	function update_eye(environparams, scale, bFollowMouse, bHighlight, 
				angleX, angleY, angleZ, locX, locY, locZ)
	{
	}
	