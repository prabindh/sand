/**** P A C K A G E    L O A D E R *****/

function packageLoader()
{
	this.load = load;
	this.is_complete = is_complete;

	function load(
				inUsername,
				inUniqueid,
				callbackFn
				)
	{
		var common = "../" + inUsername + "/" + inUniqueid + "/";
		var commonrand = Math.floor(Math.random()*100000);
		
		currPath = common;
		loader.init(postloadme, environParams.host);

		if(callbackFn != null) callbackfunction = callbackFn;
		loader.post_transaction(common + "vertex.shader?id="+commonrand, "vertex-sh", 0, 0, ""); //vertex sh
		loader.post_transaction(common + "frag.shader?id="+commonrand, "frag-sh", 0, 0, ""); //frag sh
		loader.post_transaction(common + "setup_render.js?id="+commonrand, "setup_render", 0, 0, ""); //setup
		loader.post_transaction(common + "setup_core.js?id="+commonrand, "setup_core", 0, 0, ""); //setup		
		loader.post_transaction(common + "tile.xml?id="+commonrand, "tile", 0, 0, ""); //screen
		loader.post_transaction(common + "anim.xml?id="+commonrand, "anim", 0, 0, ""); //screen		
	}

	function is_complete()
	{
		return [loader.is_complete(), [vertexshaderstring, fragshaderstring, setup_corestring, setup_renderstring, tilestring, animstring]];
	}
	
	/**** I N T E R N A L   F U N C T I O N S *****/

	var vertexshaderstring = "";
	var fragshaderstring = "";
	var setup_corestring = "";
	var setup_renderstring = "";	
	var tilestring = "";
	var animstring = "";	
	var loader;
	var currPath;
	callbackfunction = function() {showDebugOutput("load complete");};

	loader = new WORKER_object_loader();
	
	function postloadme(currData, otherData)
	{
		if(otherData == "setup_core")
		{
			setup_corestring = currData;
		}
		else if(otherData == "setup_render")
		{
			setup_renderstring = currData;
		}		
		else if(otherData == "vertex-sh")
		{
			vertexshaderstring = currData;
		}
		else if(otherData == "frag-sh")
		{
			fragshaderstring = currData;
		}
		else if(otherData == "tile")
		{
			tilestring = currData;
		}
		else if(otherData == "anim")
		{
			animstring = currData;
		}		
		if(loader.is_complete()) { 
			showDebugOutput("Completed loading");// from "+environParams.host+currPath);
			callbackfunction(vertexshaderstring, fragshaderstring, setup_corestring, setup_renderstring, tilestring, animstring);}
	}
}

function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, escape);
}


/**** P A C K A G E    S A V E R *****/

function packageSaver()
{
	this.is_complete = is_complete;
	this.save = save;

	function save(
				inUsername,
				inUniqueid,
				vertexstring,
				fragstring,
				setup_renderstring,
				screenstring,
				animstring,
				callbackFn
				)
	{
		var common = "../" + inUsername + "/" + inUniqueid + "/";
		currPath = common;
		saver.init(postsaveme, environParams.host);	

		if(callbackFn != null) callbackfunction = callbackFn;

		saver.post_transaction("write.php", "vertex-sh-post", 0, 1, "filename="+common+"vertex.shader&data="+fixedEncodeURIComponent(vertexstring));
		saver.post_transaction("write.php", "frag-sh-post", 0, 1, "filename="+common+"frag.shader&data="+fixedEncodeURIComponent(fragstring));
		saver.post_transaction("write.php", "setup-render-post", 0, 1, "filename="+common+"setup_render.js&data="+fixedEncodeURIComponent(setup_renderstring));
		saver.post_transaction("write.php", "tile-post", 0, 1, "filename="+common+"tile.xml&data="+fixedEncodeURIComponent(screenstring));
		saver.post_transaction("write.php", "anim-post", 0, 1, "filename="+common+"anim.xml&data="+fixedEncodeURIComponent(animstring));		
	}

	function is_complete()
	{
		return [saver.is_complete(), []];
	}
	
	/**** I N T E R N A L   F U N C T I O N S *****/

	var saver;
	var currPath;
	callbackfunction = function() { showDebugOutput("Package save complete");};

	saver = new WORKER_object_loader();
	
	function postsaveme(currData, otherData)
	{
		if(saver.is_complete()) 
		{
			showDebugOutput("Completed saving ");//+environParams.host+currPath);		
			callbackfunction();
		}
	}
}


/**** P A C K A G E    C O P I E R *****/

function packageCopier()
{
	this.is_complete = is_complete;
	this.copy = copy;

	function copy(
				inUsername,
				inUniqueid,
				callbackFn
				)
	{
		var common = "../" + inUsername + "/1/" ;
		var fromid = "../default2/" + inUniqueid + "/" ;
		currPath = common;
		copier.init(postcopyme, environParams.host);	

		if(callbackFn != null) callbackfunction = callbackFn;

		copier.post_transaction("copy.php", "pkg-copy", 0, 1, "tolab="+common+"&fromid="+fromid);
	}

	function is_complete()
	{
		return [copier.is_complete(), []];
	}
	
	/**** I N T E R N A L   F U N C T I O N S *****/

	var copier;
	var currPath;
	callbackfunction = function() { showDebugOutput("Package copy complete");};

	copier = new WORKER_object_loader();
	
	function postcopyme(currData, otherData)
	{
		if(copier.is_complete()) 
		{
			showDebugOutput("Completed copying");// to "+environParams.host+currPath);		
			callbackfunction();
		}
	}
}