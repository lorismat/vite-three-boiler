export default /* glsl */`
varying vec2 vUv;
uniform float time;
void main () {

  float dist = distance(vUv.xy, vec2(0.5));
  gl_FragColor = vec4(vec3(dist, abs(sin(time)), 1.0), 1.0);
}
`;