<template>
  <canvas id="c1"></canvas>
</template>

<script>

// model
// https://github.com/sciecode/sciecode.github.io

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import * as lights from '../modules/lights.js';

import vertexShader from '../glsl/test.vert.js';
import fragmentShader from '../glsl/snippets/noisy.frag.js';

let stats;
let scene, renderer, camera;
let cube, materialSphere;

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

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // plane
      const colorPlane = new THREE.Color(0xffffff)
      const geometryPlane = new THREE.PlaneGeometry(100,100);
      const materialPlane = new THREE.MeshPhongMaterial({
        color: colorPlane,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geometryPlane, materialPlane);
      plane.rotation.x = Math.PI/2;
      plane.receiveShadow = true;
      scene.add(plane);

      // cube
      const colorCube = new THREE.Color("red")
      const geometryCube = new THREE.BoxGeometry(1,1,1);
      const materialCube = new THREE.MeshPhongMaterial({
        color: colorCube
      });
      cube = new THREE.Mesh(geometryCube, materialCube);
      cube.position.set(0,3,0);
      cube.castShadow = true;
      scene.add(cube);

      // sphere
      const geometrySphere = new THREE.SphereGeometry(1,32,32);
      materialSphere = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
        }
      })
      const sphere = new THREE.Mesh(geometrySphere, materialSphere);
      sphere.position.set(4,3,2);
      scene.add(sphere);

      camera.position.set(0,2,9);
      camera.lookAt( scene.position );

      lights.init();
      scene.add( lights.mesh );

      const controls = new OrbitControls( camera, renderer.domElement );

      stats = new Stats();
      document.body.appendChild( stats.dom );

    },

    animate() {
      requestAnimationFrame(this.animate);
      const time = - performance.now() * 0.0005;
      materialSphere.uniforms.time.value = time;
      
      cube.rotation.x = time;
      cube.rotation.y = time;

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