<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let stats;
let scene, renderer, camera;
let cage;

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

      // GLTF Object under DRACO compression
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath( 'libs/draco/' );
      dracoLoader.setDecoderConfig( { type: 'js' } );
      dracoLoader.preload();

      // Load a Draco geometry
      dracoLoader.load(
        // resource URL
        'objects/bunny.drc',
        // called when the resource is loaded
        function ( geometry ) {
          geometry.computeVertexNormals();
          const material = new THREE.MeshNormalMaterial();
				  const mesh = new THREE.Mesh( geometry, material );
          mesh.scale.setScalar(10)
          scene.add( mesh );
          dracoLoader.dispose();
        });
      
      // camera init position
      camera.position.set(0,0,5);
      camera.lookAt( scene.position );

      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

    },

    animate() {
      requestAnimationFrame(this.animate);
      //const time = - performance.now() * 0.0005;

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