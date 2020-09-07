precision highp float;
attribute vec3 inVertex;
uniform mat4 MVPMatrix;
attribute vec2 inAppTexCoords;
varying vec2 TexCoord;
uniform vec4 eyePosition;
varying vec4 modeyePosition;
void main(void) 
{
    modeyePosition = MVPMatrix * eyePosition;
	gl_Position = MVPMatrix * vec4(inVertex.xyz,1.0);
	TexCoord=inAppTexCoords;
}