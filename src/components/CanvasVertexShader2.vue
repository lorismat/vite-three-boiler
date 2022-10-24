<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera, sphere;
let materialSphere;

// © Matt Deslauriers
// https://glitch.com/edit/#!/three-demo-attributes?path=sketch.js%3A36%3A2

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

      const geometry = new THREE.IcosahedronBufferGeometry(6, 5);
      
      const vertexShader = `
        uniform float explosion;
        attribute vec3 randomDirection;
        attribute float randomStrength;
        varying vec3 vOriginalPosition;
        void main () {
          vOriginalPosition = position.xyz;

          vec3 pos = position.xyz;

          pos += randomDirection * randomStrength * explosion;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
        }
      `;

      const fragmentShader = `
        // An incoming value from the vertex shader
        varying vec3 vOriginalPosition;

        void main () {
          vec3 color = normalize(vOriginalPosition) * 0.5 + 0.5;
          
          gl_FragColor = vec4(color, 1.0);
        }  
      `;

      // store the number of vertices

      const positions = geometry.getAttribute("position");
      const vertexCount = positions.count;
      const triangleCount = vertexCount / 3;

      const randomDirections = [];
      const randomStrengths = [];

      for (let i = 0; i < triangleCount; i++) {
        // Get a random unit vector
        const dir = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        )
          .normalize()
          .toArray();

        // Triplicate it and turn into a flat list of x, y, z, x, y, z...
        const directions = [dir, dir, dir].flat();
        // Concat into array
        randomDirections.push(...directions);

        // Do the same but with the 1 random strength float
        const str = Math.random() * 8;
        randomStrengths.push(str, str, str);
      }

      // Define the attributes
      const randomDirectionsAttribute = new THREE.BufferAttribute(
        new Float32Array(randomDirections),
        3
      );

      geometry.setAttribute("randomDirection", randomDirectionsAttribute);

      const randomStrengthsAttribute = new THREE.BufferAttribute(
        new Float32Array(randomStrengths),
        1
      );
      geometry.setAttribute("randomStrength", randomStrengthsAttribute);

      materialSphere = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        // The uniforms allow us to send values down into the shader
        uniforms: {
          // The amount to push particles outward
          explosion: { value: 1 }
        },
        side: THREE.DoubleSide,
      });

      sphere = new THREE.Mesh(geometry, materialSphere);

      
      scene.add(sphere);

      // camera init position
      camera.position.set(0,0,20);
      camera.lookAt( scene.position );

      // light
      const lightAmbient = new THREE.AmbientLight(0xffffff, 10);
      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

    },

    animate() {
      requestAnimationFrame(this.animate);

      const time = - performance.now() * 0.0009;
      materialSphere.uniforms.explosion.value = Math.sin(time - Math.PI / 4) * 0.5 + 0.5;

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