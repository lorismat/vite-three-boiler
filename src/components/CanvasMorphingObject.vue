<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera, clock;

let mesh, points;

let sign = 1;
let speed = 0.5;

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
      clock = new THREE.Clock();


      // camera init position
      camera.position.set(0,0,5);
      camera.lookAt( scene.position );

      // light
      const lightAmbient = new THREE.AmbientLight(0xffffff, 10);
      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

      const loader = new GLTFLoader();
				loader.load( 'objects/AnimatedMorphSphere/AnimatedMorphSphere.gltf', function ( gltf ) {
					gltf.scene.traverse( function ( node ) {
						if ( node.isMesh ) mesh = node;
					} );
					mesh.material.morphTargets = true;
					//mesh.rotation.z = Math.PI / 2;
					//mesh.material.visible = false;
					scene.add( mesh );

					const pointsMaterial = new THREE.PointsMaterial( {
						size: 10,
						sizeAttenuation: false,
						map: new THREE.TextureLoader().load( 'textures/spark1.png' ),
						alphaTest: 0.5,
						morphTargets: true
					} );
          
					points = new THREE.Points( mesh.geometry, pointsMaterial );
          points.scale.setScalar(100);
					points.morphTargetInfluences = [0,0];
					//points.morphTargetDictionary = mesh.morphTargetDictionary;
          //console.log(points.morphTargetDictionary)
					scene.add( points );
				} );

      

    },

    animate() {
      requestAnimationFrame(this.animate);

      const delta = clock.getDelta();
				if ( points !== undefined ) {
					const step = delta * speed;


					points.morphTargetInfluences[ 1 ] = points.morphTargetInfluences[ 1 ] + step * sign;
					if ( points.morphTargetInfluences[ 1 ] <= 0 || points.morphTargetInfluences[ 1 ] >= 1 ) {
						sign *= - 1;
					}

          
				}
      
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