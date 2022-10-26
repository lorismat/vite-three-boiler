<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera, sphere;

let triangleCount, geometrySphere;

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

      // world
      const geometryWorld = new THREE.BoxGeometry(1);
      const materialWorld = new THREE.MeshPhongMaterial({
        color: "red",
        side: THREE.DoubleSide
      });
      const world = new THREE.Mesh(geometryWorld, materialWorld);
      world.scale.setScalar(20);
      world.receiveShadow = true;
      scene.add(world);

      // sphere
      const colorSphere = new THREE.Color("blue");
      geometrySphere = new THREE.IcosahedronBufferGeometry(1, 3);
      const materialSphere = new THREE.MeshPhongMaterial({
        color: colorSphere
      });
      sphere = new THREE.Mesh(geometrySphere, materialSphere);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere);


      // storing all vertices
      const positions = geometrySphere.getAttribute("position");
      const vertexCount = positions.count;
      triangleCount = vertexCount / 3;
      console.log(triangleCount);

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
        const str = Math.random();
        randomStrengths.push(str, str, str);
      }
      console.log(randomStrengths);

      // Define the attributes
      const randomDirectionsAttribute = new THREE.BufferAttribute(
        new Float32Array(randomDirections),
        3
      );
      geometrySphere.setAttribute("randomDirection", randomDirectionsAttribute);

      const randomStrengthsAttribute = new THREE.BufferAttribute(
        new Float32Array(randomStrengths),
        1
      );
      geometrySphere.setAttribute("randomStrength", randomStrengthsAttribute);

      console.log(geometrySphere);

      

      // camera init position
      camera.position.set(0,0,5);
      camera.lookAt( scene.position );

      // light
      const lightAmbient = new THREE.AmbientLight(0xffffff, 1);
      scene.add(lightAmbient);


      const pointLight = new THREE.PointLight(0xffffff, 10, 1000);
      pointLight.castShadow = true;

      pointLight.shadow.mapSize.width = 512
      pointLight.shadow.mapSize.height = 512

      scene.add(pointLight);

      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

    },

    animate() {
      requestAnimationFrame(this.animate);
      const time = - performance.now() * 0.0005;

      const positions = geometrySphere.attributes.position.array;

      for ( let i = 0; i < triangleCount * 9; i ++ ) {
        positions[ i ] += ( Math.random() * 2  - 1 )* 0.01;
      }

      geometrySphere.attributes.position.needsUpdate = true;
      

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