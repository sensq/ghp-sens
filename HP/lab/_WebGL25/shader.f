uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
	vec2 uv = vUv - vec2(0.5, 0.5);
	float l = length(uv)  * 2.0;
	uv *= 1.0 + sin(l*l * 40.0) * 0.2 * (1.0 - l);
	vec4 texel = texture2D( tDiffuse, uv + vec2(0.5, 0.5));
	gl_FragColor = texel;
}