varying mediump vec2 TexCoord;
uniform sampler2D inSampler;
void main(void) {
	gl_FragColor = texture2D(inSampler, TexCoord);
}