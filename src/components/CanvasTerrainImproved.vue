<template>
  <canvas id="c1"></canvas>
</template>

<script>

import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let camera, scene, renderer;
let mesh;

const worldWidth = 70, worldDepth = 70;

let geometry;
let vertices;

const perlin = new ImprovedNoise();
const size = worldWidth * worldDepth;

// const clock = new THREE.Clock();

let seed = Math.PI / 4;
  window.Math.random = function () {

  const x = Math.sin( seed ++ ) * 10000;
  return x - Math.floor( x );
};

let inc = 10;

export default {
  methods: {

    init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xefd1b5 );
      // scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

      const data = this.generateHeight( worldWidth, worldDepth, inc );

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        20000
      );

      let canvas = document.getElementById("c1");
      renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.position.set( 100, 3000, - 1800 );
			camera.lookAt( - 100, 810, - 2500 );

      geometry = new THREE.PlaneGeometry( 2000, 2000, worldWidth - 1, worldDepth - 1 );
			geometry.rotateX( - Math.PI / 2 );

      vertices = geometry.attributes.position.array;

      for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ] * 10;
      }

      const loaderTexture = new THREE.TextureLoader();
      const texture = loaderTexture.load( "textures/grid.png" );

      // assuming you want the texture to repeat in both directions:
      texture.wrapS = THREE.RepeatWrapping; 
      texture.wrapT = THREE.RepeatWrapping;

      // how many times to repeat in each direction; the default is (1,1),
      //   which is probably why your example wasn't working
      texture.repeat.set( worldWidth - 1, worldDepth - 1 ); 

      const material = new THREE.MeshLambertMaterial({ 
        map : texture,

        // tranparent: true,
        // alphaTest: 0.5
      });

      mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
      }));
			scene.add( mesh );

      const controls = new OrbitControls( camera, renderer.domElement );

      /*
      controls = new FirstPersonControls( camera, renderer.domElement );
      controls.movementSpeed = 150;
      controls.lookSpeed = 0.1;
      */

      scene.add(new THREE.AmbientLight(0xffffff,1));

      stats = new Stats();
      document.body.appendChild( stats.dom );
      
    },

    animate() {
      requestAnimationFrame(this.animate);

      // const time = - performance.now() * 0.0005;

      inc += 0.001;

      const data = this.generateHeight( worldWidth, worldDepth, inc );
      
      for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ] * 10;
      }

      geometry.attributes.position.needsUpdate = true;

      // controls.update( clock.getDelta() );
			renderer.render( scene, camera );
      stats.update();
    },

    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight ;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },

    generateHeight(width, height, inc) {

      const data = new Float32Array( size );
      let quality = 1;

      for ( let j = 0; j < 4; j ++ ) {
        for ( let i = 0; i < size; i ++ ) {
          const x = i % width, y = ~ ~ ( i / width );
          data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, inc ) * quality * 1.75 );
        }
        quality *= 3;
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