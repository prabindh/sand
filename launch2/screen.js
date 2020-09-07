function screen(inVyuh)
{
	this.setup = setupFunc;
	this.animate = animate;
	this.scale_object = scale_object;
	this.rotate_object = rotate_object;
	this.show_selected_object = show_selected_object;	
	this.show_all_objects = show_all_objects;
	this.add_object = add_screen_object;
	this.send_ioctl = send_ioctl;
	this.set_wireframe_mode = set_wireframe_mode;
	this.clear = clear;

	this.type="screen";
	
	var vyuh = inVyuh;
	var glcontext;
	var currProgram;

	var objList = [];
	var animList = [];
	var paramObjList = [];
	var paramAnimList = [];

	var glslobj;
	
function objConfigParams()
{
	var id;
	var type;
	var locX;
	var locY;
	var locZ;
	var angleX;
	var angleY;
	var angleZ;	
	var scale;
	var textureId;
	var name;
	var uniqueID;	
};
	 function parseXml(xmlStr)
	 {
		if(xmlStr == "") return;
		
		object1 = JSON.parse(xmlStr);
		for(var i = 0;i < object1.length;i ++) objList.push(object1[i].params);
	 }
	 function parseAnimXml(anim)
	 {
		object1 = JSON.parse(anim);
		for(var i = 0;i < object1.length;i ++) 
			animList.push(object1[i]);
	 }
	
	function add_screen_object(id, type)
	{
		var newConfig = new objConfigParams();
		newConfig.modal = id;
		newConfig.type = type;
		newConfig.locX = 0.0;
		newConfig.locY = 0.0;
		newConfig.locZ = 0.0;
		newConfig.angleX = 0.0;
		newConfig.angleY = 0.0;
		newConfig.angleZ = 0.0;	
		newConfig.scale = 1.0;
		newConfig.textureId = 0;
		newConfig.name = type + paramObjList.length;
		newConfig.uniqueID = name + Math.random();
		var createdObjLi = add_single_object(newConfig, 100, 100);
		return createdObjLi;
	}
	
	
	function setupFunc(context, vshader, fshader, screenFile, animstring)
	{
		if(context)
		{
			context.bindFramebuffer(context.FRAMEBUFFER, null);
			context.enable(context.DEPTH_TEST);                               
			context.depthFunc(context.LEQUAL);
			
			context.clearColor(0.5, 0.5, 0.5, 0.);
			//context.clearColor(1.0, 0., 0., 0.);
			context.clear(context.COLOR_BUFFER_BIT|context.DEPTH_BUFFER_BIT);
			context.flush();		
		}

		glcontext = context;

		glslobj = new glslObj();
		var ret = glslobj.setup(glcontext);
		if(ret[0] == false){return ret}
		if(glslobj.vertex){ret = glslobj.vertex(vshader)}
		if(ret[0] == true){}else{return ret}
		if(glslobj.fragment){ret = glslobj.fragment(fshader)}
		if(ret[0]==true){}
			else {return ret}
		ret = glslobj.link(glcontext);
		currProgram = ret[1];

		parseXml(screenFile);
		parseAnimXml(animstring)

		return ret;
	}

	function clear()
	{
		for(var i = 0;i < paramObjList.length;i ++)
		{
			vyuh.removeMember(paramObjList[i]);
			paramObjList[i].exit();
		}
		for(var i = 0;i < paramAnimList.length;i ++)
			vyuh.removeTimeline(paramAnimList[i]);

		paramObjList = [];
		objList = [];
		animList = [];
		paramAnimList = [];
		glslobj.unlink();
		glcontext.clear(glcontext.COLOR_BUFFER_BIT|glcontext.DEPTH_BUFFER_BIT);
		glcontext.flush();

		glcontext = null;
		glslobj = null;
		currProgram = null;
	}

	function render_tile(objList, environparams)
	{
		if(paramObjList.length == 0)
		{
			add_new_object_from_list(objList);
			add_new_timeline_from_list(animList);
		}
		//do rendering	
		if(glcontext) vyuh.render(0);
		return 0; 
	}

	function animate()
	{
		render_tile(objList, get_current_environs());
		return [true];
	};

	function scale_object(name, parentname, scale)
	{	
		for(var i = 0;i < paramObjList.length;i ++)
		{
			if(paramObjList[i].params.name == parentname)
				paramObjList[i].updateScale(scale, name);
		}
		vyuh.render(0);
	}
	function rotate_object(name, parentname, angle)
	{
		for(var i = 0;i < paramObjList.length;i ++)
			if(paramObjList[i].params.name == parentname)
				paramObjList[i].updateZAngle(angle, name);
		vyuh.render(0);
	}

	function show_selected_object(name, parentname)
	{
		for(var i = 0;i < paramObjList.length;i ++)
			paramObjList[i].show_selected_object_only();
	}

	function show_all_objects()
	{
		for(var i = 0;i < paramObjList.length;i ++)
			paramObjList[i].clearSingleDraw();
	}

	function add_single_object(object, x, y)
	{
		var newObject = null;
		if(object.modal == "tutorial")
			newObject = new tutorialObj(glcontext, x, y, currProgram, object);

		if(newObject)
		{		
			showDebugOutput("Created new tutorial object successfully");
			var loaded = newObject.load_object_data();
			if(loaded[0] == true)
			{			
				paramObjList.push(newObject);
				vyuh.addMember(newObject);
			}//loaded successfully
			else
			{
				showDebugOutput("WARNING: "+object.name+" could not be created!");
			}
		}
		return null;
	}

	function add_new_object_from_list(currObjList)
	{
		for(var i = 0;i < currObjList.length;i ++)
		{
			add_single_object(currObjList[i], 100, 100);
		}//loop through all objects
	}
	function retrieve_obj_from_name(name)
	{
		for(var i = 0;i < paramObjList.length;i ++)	
		{
			if(paramObjList[i].params.name == name) return paramObjList[i];
		}
		return null;
	}
	function add_new_timeline_from_list(currAnimList)
	{
		for(var i = 0;i < currAnimList.length;i ++)
		{
			var obj1 = retrieve_obj_from_name(currAnimList[i].refname);
			if(obj1) 
			{
				var timeLine = new TimeLine(currAnimList[i].refname, 
								obj1, 
								currAnimList[i].type,
								currAnimList[i].start,
								currAnimList[i].stop,
								(currAnimList[i].times/currAnimList[i].every));
				paramAnimList.push(timeLine);
				vyuh.addTimeline(timeLine);
			}
		}//loop through all objects
	}	
	
	function send_ioctl(name, parentname, cmd, args)
	{
		for(var i = 0;i < paramObjList.length;i ++)
			if(paramObjList[i].params.name == parentname)
				paramObjList[i].ioctl(cmd, args);
		vyuh.render(0);
	}
	//this.params = paramObjList;	
	function set_wireframe_mode(arg)
	{
		for(var i = 0;i < paramObjList.length;i ++)
			paramObjList[i].ioctl(0,arg);
	}	
}
