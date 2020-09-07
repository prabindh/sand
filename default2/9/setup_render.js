

	var three_initialised = 0;
	function tutorial_render(environParams, highlightObjName)
	{	
	
		if(false == asyncLoader.is_complete()) {return;}
		if(three_initialised === 0)
		{
			three_js_init();
			three_initialised = 1;
		}
		group.rotation.y += ( 10 - group.rotation.y ) * 0.05;
		if(group.rotation.y > 9) group.rotation.y = -10;
		renderer.render( scene, camera );

	}

function three_js_init()
{
				camera = new THREE.PerspectiveCamera( 50, environParams.canvasWidth / environParams.canvasHeight, 1, 1000 );
				camera.position.set( 0, 100, 400 );

				scene = new THREE.Scene();

				var light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 0, 0, 1 );
				scene.add( light );

				group = new THREE.Object3D();
				group.position.y = 50;
				scene.add( group );

				function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

					var points = shape.createPointsGeometry();
					var spacedPoints = shape.createSpacedPointsGeometry( 100 );

					// flat shape

					var geometry = new THREE.ShapeGeometry( shape );

					var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ) ] );
					mesh.position.set( x, y, z - 125 );
					mesh.rotation.set( rx, ry, rz );
					mesh.scale.set( s, s, s );
					group.add( mesh );

					// 3d shape

					var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

					var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ) ] );
					mesh.position.set( x, y, z - 75 );
					mesh.rotation.set( rx, ry, rz );
					mesh.scale.set( s, s, s );
					group.add( mesh );


				}


				// California

				var californiaPts = [];

				californiaPts.push( new THREE.Vector2 ( 610, 320 ) );
				californiaPts.push( new THREE.Vector2 ( 450, 300 ) );
				californiaPts.push( new THREE.Vector2 ( 392, 392 ) );
				californiaPts.push( new THREE.Vector2 ( 266, 438 ) );
				californiaPts.push( new THREE.Vector2 ( 190, 570 ) );
				californiaPts.push( new THREE.Vector2 ( 190, 600 ) );
				californiaPts.push( new THREE.Vector2 ( 160, 620 ) );
				californiaPts.push( new THREE.Vector2 ( 160, 650 ) );
				californiaPts.push( new THREE.Vector2 ( 180, 640 ) );
				californiaPts.push( new THREE.Vector2 ( 165, 680 ) );
				californiaPts.push( new THREE.Vector2 ( 150, 670 ) );
				californiaPts.push( new THREE.Vector2 (  90, 737 ) );
				californiaPts.push( new THREE.Vector2 (  80, 795 ) );
				californiaPts.push( new THREE.Vector2 (  50, 835 ) );
				californiaPts.push( new THREE.Vector2 (  64, 870 ) );
				californiaPts.push( new THREE.Vector2 (  60, 945 ) );
				californiaPts.push( new THREE.Vector2 ( 300, 945 ) );
				californiaPts.push( new THREE.Vector2 ( 300, 743 ) );
				californiaPts.push( new THREE.Vector2 ( 600, 473 ) );
				californiaPts.push( new THREE.Vector2 ( 626, 425 ) );
				californiaPts.push( new THREE.Vector2 ( 600, 370 ) );
				californiaPts.push( new THREE.Vector2 ( 610, 320 ) );

				var californiaShape = new THREE.Shape( californiaPts );


				// Triangle

				var triangleShape = new THREE.Shape();
				triangleShape.moveTo(  80, 20 );
				triangleShape.lineTo(  40, 80 );
				triangleShape.lineTo( 120, 80 );
				triangleShape.lineTo(  80, 20 ); // close path


				// Heart

				var x = 0, y = 0;

				var heartShape = new THREE.Shape(); // From http://blog.burlock.org/html5/130-paths

				heartShape.moveTo( x + 25, y + 25 );
				heartShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
				heartShape.bezierCurveTo( x - 30, y, x - 30, y + 35,x - 30,y + 35 );
				heartShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
				heartShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
				heartShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
				heartShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );


				// Square

				var sqLength = 80;

				var squareShape = new THREE.Shape();
				squareShape.moveTo( 0,0 );
				squareShape.lineTo( 0, sqLength );
				squareShape.lineTo( sqLength, sqLength );
				squareShape.lineTo( sqLength, 0 );
				squareShape.lineTo( 0, 0 );


				// Rectangle

				var rectLength = 120, rectWidth = 40;

				var rectShape = new THREE.Shape();
				rectShape.moveTo( 0,0 );
				rectShape.lineTo( 0, rectWidth );
				rectShape.lineTo( rectLength, rectWidth );
				rectShape.lineTo( rectLength, 0 );
				rectShape.lineTo( 0, 0 );


				// Rounded rectangle

				var roundedRectShape = new THREE.Shape();

				( function roundedRect( ctx, x, y, width, height, radius ){

					ctx.moveTo( x, y + radius );
					ctx.lineTo( x, y + height - radius );
					ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
					ctx.lineTo( x + width - radius, y + height) ;
					ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
					ctx.lineTo( x + width, y + radius );
					ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
					ctx.lineTo( x + radius, y );
					ctx.quadraticCurveTo( x, y, x, y + radius );

				} )( roundedRectShape, 0, 0, 50, 50, 20 );


				// Circle

				var circleRadius = 40;
				var circleShape = new THREE.Shape();
				circleShape.moveTo( 0, circleRadius );
				circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
				circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
				circleShape.quadraticCurveTo( -circleRadius, -circleRadius, -circleRadius, 0 );
				circleShape.quadraticCurveTo( -circleRadius, circleRadius, 0, circleRadius );


				// Fish

				x = y = 0;

				var fishShape = new THREE.Shape();

				fishShape.moveTo(x,y);
				fishShape.quadraticCurveTo(x + 50, y - 80, x + 90, y - 10);
				fishShape.quadraticCurveTo(x + 100, y - 10, x + 115, y - 40);
				fishShape.quadraticCurveTo(x + 115, y, x + 115, y + 40);
				fishShape.quadraticCurveTo(x + 100, y + 10, x + 90, y + 10);
				fishShape.quadraticCurveTo(x + 50, y + 80, x, y);


				// Arc circle

				var arcShape = new THREE.Shape();
				arcShape.moveTo( 50, 10 );
				arcShape.absarc( 10, 10, 40, 0, Math.PI*2, false );

				var holePath = new THREE.Path();
				holePath.moveTo( 20, 10 );
				holePath.absarc( 10, 10, 10, 0, Math.PI*2, true );
				arcShape.holes.push( holePath );


				// Smiley

				var smileyShape = new THREE.Shape();
				smileyShape.moveTo( 80, 40 );
				smileyShape.absarc( 40, 40, 40, 0, Math.PI*2, false );

				var smileyEye1Path = new THREE.Path();
				smileyEye1Path.moveTo( 35, 20 );
				// smileyEye1Path.absarc( 25, 20, 10, 0, Math.PI*2, true );
				smileyEye1Path.absellipse( 25, 20, 10, 10, 0, Math.PI*2, true );

				smileyShape.holes.push( smileyEye1Path );

				var smileyEye2Path = new THREE.Path();
				smileyEye2Path.moveTo( 65, 20 );
				smileyEye2Path.absarc( 55, 20, 10, 0, Math.PI*2, true );
				smileyShape.holes.push( smileyEye2Path );

				var smileyMouthPath = new THREE.Path();
				// ugly box mouth
				// smileyMouthPath.moveTo( 20, 40 );
				// smileyMouthPath.lineTo( 60, 40 );
				// smileyMouthPath.lineTo( 60, 60 );
				// smileyMouthPath.lineTo( 20, 60 );
				// smileyMouthPath.lineTo( 20, 40 );

				smileyMouthPath.moveTo( 20, 40 );
				smileyMouthPath.quadraticCurveTo( 40, 60, 60, 40 );
				smileyMouthPath.bezierCurveTo( 70, 45, 70, 50, 60, 60 );
				smileyMouthPath.quadraticCurveTo( 40, 80, 20, 60 );
				smileyMouthPath.quadraticCurveTo( 5, 50, 20, 40 );

				smileyShape.holes.push( smileyMouthPath );


				// Spline shape + path extrusion

				var splinepts = [];
				splinepts.push( new THREE.Vector2 ( 350, 100 ) );
				splinepts.push( new THREE.Vector2 ( 400, 450 ) );
				splinepts.push( new THREE.Vector2 ( -140, 350 ) );
				splinepts.push( new THREE.Vector2 ( 0, 0 ) );

				var splineShape = new THREE.Shape(  );
				splineShape.moveTo( 0, 0 );
				splineShape.splineThru( splinepts );

				// splineShape.debug( document.getElementById("debug") );

				var apath = new THREE.SplineCurve3();
				apath.points.push(new THREE.Vector3(-50, 150, 10));
				apath.points.push(new THREE.Vector3(-20, 180, 20));
				apath.points.push(new THREE.Vector3(40, 220, 50));
				apath.points.push(new THREE.Vector3(200, 290, 100));
		
				var extrudeSettings = { amount: 20 }; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5

				// addShape( shape, color, x, y, z, rx, ry,rz, s );

				addShape( californiaShape, extrudeSettings, 0xffaa00, -300, -100, 0, 0, 0, 0, 0.25 );

				extrudeSettings.bevelEnabled = true;
				extrudeSettings.bevelSegments = 2;
				extrudeSettings.steps = 2;

				addShape( triangleShape, extrudeSettings, 0xffee00, -180, 0, 0, 0, 0, 0, 1 );
				addShape( roundedRectShape, extrudeSettings, 0x005500, -150, 150, 0, 0, 0, 0, 1 );
				addShape( squareShape, extrudeSettings, 0x0055ff, 150, 100, 0, 0, 0, 0, 1 );
				addShape( heartShape, extrudeSettings, 0xff1100, 60, 100, 0, 0, 0, Math.PI, 1 );
				addShape( circleShape, extrudeSettings, 0x00ff11, 120, 250, 0, 0, 0, 0, 1 );
				addShape( fishShape, extrudeSettings, 0x222222, -60, 200, 0, 0, 0, 0, 1 );
				addShape( smileyShape, extrudeSettings, 0xee00ff, -200, 250, 0, 0, 0, Math.PI, 1 );
				addShape( arcShape, extrudeSettings, 0xbb4422, 150, 0, 0, 0, 0, 0, 1 );

				extrudeSettings.extrudePath = apath;
				extrudeSettings.bevelEnabled = false;
				extrudeSettings.steps = 20;

				addShape( splineShape, extrudeSettings, 0x888888, -50, -100, -50, 0, 0, 0, 0.2 );

				var hemisphereGeom = new THREE.SphereGeometry( 45, 32, 16,
												   0, 2*Math.PI, 0, Math.PI/2 );
				var tubeGeom = new THREE.CylinderGeometry( 45, 15, 58, 32, 5, true );
				var yellowMat = new THREE.MeshLambertMaterial( {
						 color: "yellow",
					 } );
				var top = new THREE.Mesh( hemisphereGeom, yellowMat );
				var bottom = new THREE.Mesh( hemisphereGeom, yellowMat );
				var pill = new THREE.Mesh( tubeGeom, yellowMat );
				top.position.y = 44;  // move to top of cylinder
				bottom.rotation.x = Math.PI; // rotate so it's facing down
				bottom.position.y = -44; // move to bottom of cylinder
				pill.add(top);
				pill.add(bottom);
				scene.add(pill);

				renderer = new THREE.WebGLRenderer( { antialias: true }, context3dStore );
				renderer.setClearColor( 0xf0f0f0 );
				renderer.setSize( environParams.canvasWidth, environParams.canvasHeight );

				//container.appendChild( renderer.domElement );
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
		context3dStore.generateMipmap(context3dStore.TEXTURE_2D);
		context3dStore.texParameteri(context3dStore.TEXTURE_2D, 
				context3dStore.TEXTURE_MAG_FILTER, 
				//context3dStore.NEAREST);
				context3dStore.LINEAR);
				//context3dStore.LINEAR_MIPMAP_NEAREST);				
				//context3dStore.LINEAR_MIPMAP_LINEAR);				
		context3dStore.texParameteri(context3dStore.TEXTURE_2D,
				context3dStore.TEXTURE_MIN_FILTER,
				//context3dStore.NEAREST);
				context3dStore.LINEAR);
				//context3dStore.LINEAR_MIPMAP_NEAREST);
				//context3dStore.LINEAR_MIPMAP_LINEAR);
		//context3dStore.generateMipmap(context3dStore.TEXTURE_2D);				
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
	
	function update_eye(environParams, scale, bFollowMouse, bHighlight, 
				angleX, angleY, angleZ, locX, locY, locZ)
	{
		var matrix3 = new J3DIMatrix4(); //m.view matrix         
		var matrix1 = new J3DIMatrix4();	
		
		matrix3.makeIdentity();
		matrix1.makeIdentity();

		matrix1.rotate(angleX + objParams.angleX, 1,0,0);
		matrix1.rotate(angleY + objParams.angleY, 0,1,0);
		matrix1.rotate(angleZ + objParams.angleZ, 0,0,1);

		var matrixLoc =  context3dStore.getUniformLocation(programObj,"MVPMatrix");
		context3dStore.uniformMatrix4fv(matrixLoc,
			  false, new Float32Array(matrix1.getAsArray()) );	
	}
	