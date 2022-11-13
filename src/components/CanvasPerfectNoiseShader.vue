<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import fragmentShader from '../glsl/snippets/frankfurt/test.frag.js';
import vertexShader from '../glsl/snippets/frankfurt/test.vert.js';

let stats;
let scene, renderer, camera;
let sphere;

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

      camera.position.set(0,0,5);
      camera.lookAt( scene.position );
      const controls = new OrbitControls( camera, renderer.domElement );
      stats = new Stats();
      document.body.appendChild( stats.dom );

      const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
      const sphereMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0}
        }
      });
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);

    },

    animate() {
      requestAnimationFrame(this.animate);
      const time = - performance.now() * 0.0005;

      sphere.material.uniforms.time.value = time;

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