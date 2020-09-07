	function tutorial_render(environparams, highlightObjName)
	{	
		if(false == asyncLoader.is_complete()) {return;}
		var transparent;

		context3dStore.disable(context3dStore.DEPTH_TEST);
		for(var bindId = 0;bindId < vertexbuffer.length;bindId ++)
		{
			var highlight = false;
	
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

	
		var matrix3 = new J3DIMatrix4(); //m.view matrix         
		var matrix1 = new J3DIMatrix4();		
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
		
		matrix3.scale(scale + objParams.scale, scale + objParams.scale*0.1, 1.0);	
		
		matrix1.lookat(
				0, 0.8, -8.5, //eye
				0, 0, 0, //center
				0, 10, 0); //up			

		//projection * view
		matrix1.multiply(matrix3);

		var matrixLoc =  context3dStore.getUniformLocation(programObj,"MVPMatrix1");
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
