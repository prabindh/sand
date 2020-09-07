/**
	Animations so easy to get in. Vyuh.
	Vyuh does NOT work on parents, children like other 2D frameworks, do not fit in OpenGL.
	All members of Vyuh will be animated at the fastest rate among all members
	ie, all objects in screen will be redrawn at every animation event
*/

function TimeLine(highlightObjName, highlightObj, animationType, starttime, endtime, rate)
{
	this.uniqID = Math.random();
	this.subObjName = highlightObjName;
	this.object = highlightObj;
	this.animationType = animationType;
	this.startTime = starttime;
	this.endTime = endtime;
	this.rate = rate;
}

function Vyuh()
{
	this.addMember = function(object)
	{
		members.push(object);
	}
	this.removeMember = function(object)
	{
		for(var i = 0;i < members.length;i ++)
		{
			if(members[i] == object)
			{
				members.splice(i, 1);
				break;
			}
		}
	}	
	this.getAnimatingMembers = function()
	{
		return animatingMembers;
	}

	this.ZoomInOut = function(timeline)
	{
		var deltaScale;
		var currStep;
		var object = timeline.object;
		var subObjectName = timeline.subObjName;
		var startTime = timeline.startTime;
		var steps = (timeline.endTime-startTime)*timeline.rate;
		this.timeLine = timeline;
		
		function update_next_scale()
		{
			if(currStep < steps/2)
				deltaScale += 0.0001; //0.01;
			else
				deltaScale -= 0.0002; //0.02;
		}
		function onFinish()	{}
		
		this.setFinish = function(func) {onFinish = func;}
		this.start = function()
		{
			setTimeout(this.startDelayed, startTime*1000);
		}
		
		this.startDelayed = function()
		{
			currStep = 0;
			deltaScale = 0;
			var id = setInterval(
						function(){
							update_next_scale();
							object.updateScale(deltaScale, subObjectName);
							__render(timeline.rate);
							currStep ++;
							if(currStep > steps) {
								clearInterval(id);
								onFinish();
							}
						},
						1000/timeline.rate);
		}//start
	};

	this.RotatePushIn = function(timeline)
	{
		var deltaZ = -0.1;
		var deltaAngle = 15;
		var currStep;
		var object = timeline.object;
		var subObjectName = timeline.subObjName;
		var startTime = timeline.startTime;
		var steps = (timeline.endTime-startTime)*timeline.rate;
		this.timeLine = timeline;
		var intervalId;
		
		function onFinish()	{}
		this.setFinish = function(func)
		{
			onFinish = func;
		}
		this.start = function()
		{
			setTimeout(this.startDelayed, startTime*1000);
		}
		
		this.startDelayed = function()
		{
			currStep = 0;
			intervalId = setInterval(
						function(){
							object.updateZ(deltaZ, subObjectName);
							object.updateAngle(deltaAngle, subObjectName);
							__render(timeline.rate);
							currStep ++;
							if(currStep > steps) {
								clearInterval(intervalId);
								onFinish();
							}
						},
						1000/timeline.rate);
		}//start
		this.stop = function()
		{
			//kill intervalid
			clearInterval(intervalId);
		}
	};

	this.PushIn = function(timeline)
	{
		var deltaZ = -0.1;
		var currStep;
		var object = timeline.object;
		var subObjectName = timeline.subObjName;
		var startTime = timeline.startTime;
		var steps = (timeline.endTime-startTime)*timeline.rate;
		this.timeLine = timeline;	
		var intervalId;
		
		function onFinish() {}
		
		this.setFinish = function(func)
		{
			onFinish = func;
		}
		
		this.start = function()
		{
			setTimeout(this.startDelayed, startTime*1000);
		}
		
		this.startDelayed = function()
		{
			currStep = 0;
			intervalId = setInterval(
						function(){
							object.updateZ(deltaZ, subObjectName);
							__render(timeline.rate);
							currStep ++;
							if(currStep > steps) {
								clearInterval(intervalId);
								onFinish();
							}
						},
						1000/timeline.rate);
		}//start
		this.stop = function()
		{
			//kill intervalid
			clearInterval(intervalId);
		}		
	};

	this.RotateY = function(timeline)
	{
		var deltaAngle = 15;
		var currStep;
		var object = timeline.object;
		var subObjectName = timeline.subObjName;
		var startTime = timeline.startTime;
		var steps = (timeline.endTime-startTime)*timeline.rate;
		this.timeLine = timeline;
		var intervalId;
		
		function onFinish()	{}
		this.setFinish = function(func)
		{
			onFinish = func;
		}
		
		this.start = function()
		{
			setTimeout(this.startDelayed, startTime*1000);
		}
		
		this.startDelayed = function()
		{
			currStep = 0;
			intervalId = setInterval(
						function(){
							object.updateYAngle(deltaAngle, subObjectName);
							__render(timeline.rate);
							currStep ++;
							if(currStep > steps) {
								clearInterval(intervalId);
								onFinish();
							}
						},
						(1000/timeline.rate));
		}//start
		this.stop = function()
		{
			//kill intervalid
			this.timeLine = null;
			clearInterval(intervalId);		
		}		
	};	
	
	//TODO - should not just render - need to find if already update is happening, if so, just return
	//Otherwise each update will end up updating_all for all the time!
	this.render = function(currUpdateTime)
	{
		/* TODO - Early return if already updates are queued by other objects, OR, if we are too late due to heavy render processing */
		/* clear for animations */
		glcontext.clear(glcontext.COLOR_BUFFER_BIT|glcontext.DEPTH_BUFFER_BIT);
		glcontext.flush();
	
		var currenv = get_current_environs();
		for(var i = 0;i < members.length;i ++)
		{
			members[i].render(currenv, false, false);
		}
	}
	
	//Add animation to an object
	this.addTimeline = function(timeline)
	{
		var animatingObj;
		if(timeline.animationType == "RotateY")
			animatingObj = new this.RotateY(timeline);
		else if(timeline.animationType == "PushIn")
			animatingObj = new this.PushIn(timeline);
		else return null;

		animatingMembers.push(animatingObj);
		return animatingObj;
	}
	this.removeTimeline = function(timeline)
	{
		for(var i = 0;i < animatingMembers.length;i ++)
		{
			if(animatingMembers[i].timeLine == timeline)
			{
				animatingMembers[i].stop();
				//remove this member from list of animators - TODO
				animatingMembers.splice(i, 1);
			}
		}
	}
	//start all animations
	this.animateStart = function()
	{
		for(var i = 0;i < animatingMembers.length;i ++)
			animatingMembers[i].start();
	}
	//stop
	this.animateStop = function()
	{
		for(var i = 0;i < animatingMembers.length;i ++)
			animatingMembers[i].stop();	
	}

	/** 
		INTERNAL IMPLEMENTATION
	*/

	var members = [];
	var __render = this.render;
	var animatingMembers = [];
};
