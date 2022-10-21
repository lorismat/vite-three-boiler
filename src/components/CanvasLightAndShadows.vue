<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera;

// shadow map and lightening
// https://threejs.org/docs/index.html?q=shado#api/en/lights/shadows/PointLightShadow

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
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap - also - THREE.BasicShadowMap

      // camera init position
      camera.position.set(0,5,5);
      camera.lookAt( scene.position );

      // plane geometry and reflecting material
      const widthPlane = 10;
      const heightPlane = 10;
      const geometryPlane = new THREE.PlaneGeometry( widthPlane, heightPlane );
      const materialPlane = new THREE.MeshPhongMaterial( {
        color: 0x000000, 
        side: THREE.DoubleSide,
        shininess: 10,
				specular: 0x222222
      } );
      const meshPlane = new THREE.Mesh( geometryPlane, materialPlane );
      
      meshPlane.receiveShadow = true;

      meshPlane.rotation.x = Math.PI/2;
      meshPlane.position.set(0,0,0);
      scene.add( meshPlane );

      // cube geometry and reflecting material
      const cubeDimensions = 2;
      const geometryCube = new THREE.BoxGeometry(1);
      const materialCube = new THREE.MeshPhongMaterial( {
        color: 0xffffff
      } );
      const meshCube = new THREE.Mesh( geometryCube, materialCube );

      meshCube.castShadow = true;

      meshCube.scale.setScalar(cubeDimensions);
      meshCube.position.y += cubeDimensions/2;
      scene.add( meshCube );


      // light ambient
      // const lightAmbient = new THREE.AmbientLight(0xff00ff, 10);

      // light point
      const lightPoint = new THREE.PointLight( 0xffffff, 4);
      
      lightPoint.castShadow = true;
			lightPoint.shadow.bias = - 0.000003; // reduces self-shadowing on double-sided objects

      //Set up shadow properties for the light
      lightPoint.shadow.camera.left = -10
      lightPoint.shadow.camera.right = 10
      lightPoint.shadow.camera.top = 10
      lightPoint.shadow.camera.bottom = -10
      lightPoint.shadow.camera.near = 10
      lightPoint.shadow.camera.far = 400
      lightPoint.shadow.mapSize.width = 1024
      lightPoint.shadow.mapSize.height = 1024

      lightPoint.position.set( -10, 10, -20 );
      scene.add( lightPoint );
  
      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

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