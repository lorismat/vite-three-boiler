<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

// fast simplex noise javascript
// more here
// https://github.com/joshforisha/fast-simplex-noise-js

import { makeNoise2D,  makeNoise3D } from 'fast-simplex-noise';

// GLSL noise
// more here
// https://github.com/stegu/psrdnoise

import { psrdnoise2GLSL } from '../utils/psrdnoise2-min.js';
import { simpleNoiseGLSL } from '../utils/simplenoise.js';

const noise2D = makeNoise2D();

let stats;
let scene, renderer, camera, plane;
let materialPlane;

export default {
  methods: {

    init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        3000
      );

      let canvas = document.getElementById("c1");
      renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize(window.innerWidth, window.innerHeight);

      const geometryPlane = new THREE.PlaneGeometry(10,10,30,30);

      // play with vertex shaders
      // https://codingxr.com/articles/shaders-in-threejs/ 
      // https://github.com/markhorgan/three-js-shaders/blob/main/src/shader.vert
      // https://www.youtube.com/watch?v=VwSRizyr1pI
      

      const vertexShader = `

        varying vec2 vUv;
        uniform float time;
        attribute float aRandom;
        
        void main () {
          vUv = uv;
          vec3 newPosition = position;

          newPosition.x += abs(sin(time * aRandom));
          newPosition.y += abs(cos(time * aRandom));

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `;

      const fragmentShader = `

        #define TWO_PI 6.28318530718

        varying vec2 vUv;
        uniform float time;

        // color transform
        vec3 hsb2rgb( in vec3 c ){
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                            6.0)-3.0)-1.0,
                            0.0,
                            1.0 );
          rgb = rgb*rgb*(3.0-2.0*rgb);
          return c.z * mix( vec3(1.0), rgb, c.y);
        }

        void main () {          
          vec2 st = vUv;

          // Use polar coordinates instead of cartesian
          vec2 toCenter = vec2(0.5)-st;
          float angle = atan(toCenter.y,toCenter.x);
          float radius = length(toCenter)*2.0;

          vec3 color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

          gl_FragColor = vec4(color, 1.0);
        
        }
      `;

      
      materialPlane= new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
          uDisplacementScale: { value: 0.3 },
        },
        side: THREE.DoubleSide,
      });

      // store the number of vertices
      const countVertices = geometryPlane.attributes.position.count;
      const randoms = new Float32Array(countVertices);
      for (let i = 0; i<countVertices; i++) {
        randoms[i] = Math.random() * 2 - 1;
      }

      geometryPlane.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
      console.log(geometryPlane);

      plane = new THREE.Mesh(geometryPlane, materialPlane);

      
      scene.add(plane);

      // camera init position
      camera.position.set(0,0,20);
      camera.lookAt( scene.position );

      // light
      const lightAmbient = new THREE.AmbientLight(0xffffff, 10);
      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

      // GUI
      const gui = new GUI();

      const effectController = {
        size: 1
      };

      const matChanger = function () {
        plane.scale.setScalar(effectController.size);
      };

      gui.add( effectController, "size", 0.2, 10, 0.1 ).onChange( matChanger );

      gui.close();
      matChanger();

    },

    animate() {
      requestAnimationFrame(this.animate);

      const time = - performance.now() * 0.0005;
      materialPlane.uniforms.time.value = time;

      renderer.render(scene, camera);
      stats.update();
    },

    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight ;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

  },
  created() {
    window.addEventListener("resize", this.onWindowResize);
  },
  mounted() {
    this.init();
    this.animate();
  }
}
</script>