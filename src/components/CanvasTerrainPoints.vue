<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

// https://zubazor.medium.com/visualizing-a-mountain-using-three-js-landsat-and-srtm-26275c920e34
// https://www.youtube.com/watch?v=U9q-jM3-Phc
// check out fbm (fractional brawnian motion)
// think of adding a grid helper to have the grid
// perlin terrain in processing
// https://www.youtube.com/watch?v=IKB1hWWedMk

let stats;
let scene, renderer, camera;

const noise = new SimplexNoise();

const gridFactor = 100;
 
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
      renderer.setClearColor( 0xeeeeee, 1 );

      camera.position.set(0,30,200);
      camera.lookAt( scene.position );

      const controls = new OrbitControls( camera, renderer.domElement );

      stats = new Stats();
      document.body.appendChild( stats.dom );

      const vertices = [];

      let xOff = 0; let yOff = 0; let zOff = 0;
      let xInc = 0.05; let yInc = 0.05; let zInc = 0.04;
      
      for ( let i = -gridFactor/2; i < gridFactor/2; i ++ ) {
        for ( let j = -gridFactor/2; j < gridFactor/2; j ++ ) {
          xOff += xInc;
          zOff += zInc;
          const x = i; 
          const y = noise.noise3d(xOff, yOff, 1) * 10;
          const z = j;
          vertices.push( x, y, z );
        }
        yOff += yInc;
        xOff = 0;
      }


      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

      const material = new THREE.PointsMaterial( { 
        color: 0x000000,
        size: 0.2,
      } );
      const points = new THREE.Points( geometry, material );

      scene.add( points );

    },

    animate() {

      requestAnimationFrame(this.animate);
      const time = - performance.now() * 0.0005;

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