<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';


// https://zubazor.medium.com/visualizing-a-mountain-using-three-js-landsat-and-srtm-26275c920e34
// https://www.youtube.com/watch?v=U9q-jM3-Phc
// check out fbm (fractional brawnian motion)
// think of adding a grid helper to have the grid
// perlin terrain in processing
// https://www.youtube.com/watch?v=IKB1hWWedMk

let stats;
let scene, renderer, camera;

let geometry;

const worldWidth = 100, worldDepth = 100;
let inc = 10;

export default {
  methods: {

    init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );

      let canvas = document.getElementById("c1");
      renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor( 0xeeeeee, 1 );

      camera.position.set(0,1500,2500);
      camera.lookAt( scene.position );

      const controls = new OrbitControls( camera, renderer.domElement );

      stats = new Stats();
      document.body.appendChild( stats.dom );


      // define a specific grid
      geometry = new THREE.PlaneGeometry( 3000, 3000, worldWidth - 1, worldDepth - 1 );
			geometry.rotateX(-Math.PI /2 );

      const material = new THREE.MeshBasicMaterial( { 
        color: 0x000000,
        wireframe: true
      } );


      const data = this.generateHeight( worldWidth, worldDepth, inc );
      const vertices = geometry.attributes.position.array;
      for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ] * 20;
      }

      const plane = new THREE.Mesh( geometry, material );
      scene.add( plane );

    },

    animate() {

      requestAnimationFrame(this.animate);
      const time = - performance.now() * 0.0005;

      inc += 0.001;

      const data = this.generateHeight( worldWidth, worldDepth, inc );
      
      const vertices = geometry.attributes.position.array;
      for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ] * 20;
      }

      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      stats.update();
    },

    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight ;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },

    generateHeight(width, height, inc) {

      let seed = Math.PI / 4;
				window.Math.random = function () {

					const x = Math.sin( seed ++ ) * 10000;
					return x - Math.floor( x );

				};

      const size = width * height, data = new Float32Array( size );

      /* IMPROVED NOISE
      const perlin = new ImprovedNoise(), z = Math.random() * 100;

      let quality = 1;

      for ( let j = 0; j < 4; j ++ ) {
        for ( let i = 0; i < size; i ++ ) {
          const x = i % width, y = ~ ~ ( i / width );
          data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
        }
        quality *= 5;
      }
      */

     const noise = new SimplexNoise();

      for ( let i = 0; i < size; i ++ ) {
        const x = i % width, y = ~ ~ ( i / width );
        data[ i ] += Math.abs( noise.noise3d( x*0.02, y*0.025, inc) * 30);
      }
      
      
      return data;
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