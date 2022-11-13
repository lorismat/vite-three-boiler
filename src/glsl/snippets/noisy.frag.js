export default /* glsl */`

#define PI 3.14

varying vec2 vUv;
uniform float time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main () {
  vec2 st = vUv;
  // 

  float rnd = random( st );
  gl_FragColor = vec4(vec3(rnd),1.0);

}
`;