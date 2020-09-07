/** Just does shader and Program management 
*/
function glslObj()
{
	this.setup = setupFunc;
	this.vertex = shadervertexsetup_new;
	this.fragment= shaderfragmentsetup_new;
	this.link = linkprogram;
	this.unlink = unlinkprogram;
	
	var glcontext;
	var currProgram;
	var programObject;
	
	function setupFunc(context)
	{
		glcontext = context;
		
		programObject = new Program(glcontext);
		currProgram = programObject.getProgramObj();
		
		return [true];
	}

	// Setup program and link
	function linkprogram()
	{			
		var ret = programObject.link();
		return [true, currProgram];
	}
	// unlink
	function unlinkprogram()
	{			
		var ret = programObject.unlink();
		return [true, currProgram];
	}	

	// Sets up vertex shader, and the vertices
	function shadervertexsetup_new(shader)
	{
		programObject.compileVertexShader(shader);
		glcontext.bindAttribLocation(currProgram, 1, "inAppTexCoords");
		return [true,1];
	}

	function shaderfragmentsetup_new (shader)
	{
		programObject.compileFragShader(shader);
		return [true];
	};	
	
}