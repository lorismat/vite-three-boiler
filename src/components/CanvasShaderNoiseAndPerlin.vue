<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { makeNoise2D,  makeNoise3D } from 'fast-simplex-noise';

// GLSL noise
// more here
// https://github.com/stegu/psrdnoise

import { psrdnoise2 } from '../utils/psrdnoise2-min.js';
import { simpleNoise } from '../utils/simplenoise.js';

const noise2D = makeNoise2D();

let stats;
let scene, renderer, camera, cube;
let materialCube;

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

      // cube
      const geometryCube = new THREE.BoxGeometry(1,1,1);

      const vertexShader = `
        varying vec2 vUv;
        void main () {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `

        varying vec2 vUv;
        uniform float time;

        ${simpleNoise}
        ${psrdnoise2}

        float noise2D (in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main () {

          float rand = random(vUv);

          float n = noise2D(vec2(vUv.x*3.0*abs(sin(time)),vUv.y*3.0));
          gl_FragColor = vec4(vec3(rand, n, n), 1.0);
          
          // float n = noise2D(vUv*3.0);
          // gl_FragColor = vec4(vec3(rand, n, n), 1.0);
        }
      `;

      materialCube = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
        }
      })

      cube = new THREE.Mesh(geometryCube, materialCube);
      scene.add(cube);

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
        cubeSizeX: 1,
        cubeSizeY: 1,
        cubeSizeZ: 1,
        wireframe: false
      };

      const matChanger = function () {
        cube.scale.x = effectController.cubeSizeX;
        cube.scale.y = effectController.cubeSizeY;
        cube.scale.z = effectController.cubeSizeZ;
        cube.material.wireframe = effectController.wireframe;
      };

      gui.add( effectController, "cubeSizeX", 0, 5, 0.1 ).onChange( matChanger );
      gui.add( effectController, "cubeSizeY", 0, 5, 0.1 ).onChange( matChanger );
      gui.add( effectController, "cubeSizeZ", 0, 5, 0.1 ).onChange( matChanger );
      gui.add( effectController, "wireframe").onChange( matChanger );

      gui.close();
      matChanger();

    },

    animate() {
      requestAnimationFrame(this.animate);

      const time = - performance.now() * 0.0005;
      materialCube.uniforms.time.value = time;

      const f = 2;
      const a = 5;
      
      cube.rotation.x = time;
      cube.rotation.y = time;

      cube.position.x = Math.sin(time*f) * a;
      cube.position.z = Math.cos(time*f) * a;
      cube.position.y = noise2D(time*0.9,time*1.3);

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