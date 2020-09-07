attribute vec4 inVertex;
uniform mat4 MVPMatrix;
attribute vec2 inAppTexCoords;
varying vec2 TexCoord;
void main(void) 
{
	gl_Position = MVPMatrix * inVertex;
	TexCoord=inAppTexCoords;
}