<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera, cube;

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

      // cube
      const colorCube = new THREE.Color("red")
      const geometryCube = new THREE.BoxGeometry(1,1,1);
      const materialCube = new THREE.MeshBasicMaterial({
        color: colorCube,
        wireframe: false
      });
      cube = new THREE.Mesh(geometryCube, materialCube);
      scene.add(cube);

      // camera init position
      camera.position.set(0,0,5);
      camera.lookAt( scene.position );

      // light
      const lightAmbient = new THREE.AmbientLight(0xffffff, 10);
      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

      // GUI
      const gui = new GUI();

      const effectController = {
        cubeSizeX: 1,
        cubeSizeY: 1,
        cubeSizeZ: 1,
        wireframe: false
      };

      const matChanger = function () {
        cube.scale.x = effectController.cubeSizeX;
        cube.scale.y = effectController.cubeSizeY;
        cube.scale.z = effectController.cubeSizeZ;
        cube.material.wireframe = effectController.wireframe;
      };

      gui.add( effectController, "cubeSizeX", 0, 5, 0.1 ).onChange( matChanger );
      gui.add( effectController, "cubeSizeY", 0, 5, 0.1 ).onChange( matChanger );
      gui.add( effectController, "cubeSizeZ", 0, 5, 0.1 ).onChange( matChanger );
      gui.add( effectController, "wireframe").onChange( matChanger );

      gui.close();
      matChanger();

    },

    animate() {
      requestAnimationFrame(this.animate);
      const time = - performance.now() * 0.0005;
      
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
  mounted() {
    window.addEventListener("resize", this.onWindowResize);
    this.init();
    this.animate();
  }
}
</script>