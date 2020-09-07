/**
* Class that provides GL program functionality
*/
function Program(context)
{	
	this.getProgramObj = function()
	{
		return currProgramObj;
	}
	
	this.compileVertexShader = function(shaderString)
	{
		currContext.shaderSource(currVertexShaderObj, shaderString);
		currContext.compileShader(currVertexShaderObj);	
		//alert((currContext.getShaderParameter(currVertexShaderObj, currContext.COMPILE_STATUS) != 0));
		return (currContext.getShaderParameter(currVertexShaderObj, currContext.COMPILE_STATUS) != 0);
	}
	
	this.compileFragShader = function(shaderString)
	{
		currContext.shaderSource(currFragShaderObj, shaderString);
		currContext.compileShader(currFragShaderObj);	
		return (currContext.getShaderParameter(currFragShaderObj, currContext.COMPILE_STATUS) != 0);	
	}
	
	this.getVShaderObj = function()
	{
		return currVertexShaderObj;
	}

	this.getFShaderObj = function()
	{
		return currFragShaderObj;
	}
	
	this.link = function()
	{
		//attach shaders and link program
		//return program
		currContext.attachShader(currProgramObj, currVertexShaderObj);		
		currContext.attachShader(currProgramObj, currFragShaderObj);	
		currContext.linkProgram(currProgramObj);
		currContext.useProgram(currProgramObj);
		return (currContext.getProgramParameter(
				currProgramObj, 
				currContext.LINK_STATUS) != 0);
	}
	this.unlink = function()
	{
		currContext.useProgram(null);		
		currContext.deleteShader(currVertexShaderObj);
		currContext.deleteShader(currFragShaderObj);
		currContext.deleteProgram(currProgramObj);	
	}
	
	
	/******
	 I N T E R N A L   I M P L E M E N T A T I O N
	*******/
	var currContext = context;
	var currProgramObj = currContext.createProgram();
	var currVertexShaderObj = currContext.createShader(currContext.VERTEX_SHADER);
	var currFragShaderObj = currContext.createShader(currContext.FRAGMENT_SHADER);		
}
