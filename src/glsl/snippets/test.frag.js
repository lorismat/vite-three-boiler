export default /* glsl */`

#define PI 3.14

varying vec2 vUv;
uniform float time;
void main () {
  vec2 st = vUv;
  // 

  vec3 color = vec3(1.);
  st = fract(st*10.);
  float t = 0.03;
  vec2 br = 1. - step(st,vec2(t));
  vec2 tl = 1. - step(1.-st,vec2(t));
  gl_FragColor = vec4(vec3(br.x * br.y * tl.x * tl.y),1.);

}
`;