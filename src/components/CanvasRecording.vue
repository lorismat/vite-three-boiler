<template>
  <div>
    <div class="btn-container">
      <button @click="startRecording">record gif</button>
    </div>
    <canvas id="c1"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera, cube;

// for gif recording
let canvas, capturer;
let frame = 0;
const stopFrame = 50;

export default {
  methods: {
    startRecording() {
      // https://github.com/spite/ccapture.js/
      // include libraries in the html script via App (injection onMount) OR
      // directly in the html file, depending on the vue version:   ===    script src="/libs/CCapture.all.min.js" 
      // two files are required in the libs (public folder)
      // CCapture.all.min.js and gif.worker.js
      // add a startRecording method to the button
      
      capturer = new CCapture({ 
        framerate: 30,
        // name: `gif_${Math.random().toFixed(2)}`,
        // startTime: 1,
        // motionBlurFrames: 1,
        format: 'gif', 
        workersPath: '/libs/'
      });
      capturer.start();

      // this.init();
      this.trigger = 0;
      
    },
    init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        3000
      );

      canvas = document.getElementById("c1");
      renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize(window.innerWidth, window.innerHeight);

      // cube
      const colorCube = new THREE.Color("turquoise")
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

    },

    animate() {
      requestAnimationFrame(this.animate);
      const time = - performance.now() * 0.0005;
      
      cube.rotation.x = time;
      cube.rotation.y = time;

      renderer.render(scene, camera);
      stats.update();
      
      if (this.trigger < 1 && capturer != undefined) {
        frame += 1;
        capturer.capture(canvas);
        if (frame > stopFrame) {
          capturer.stop();
          capturer.save();
          this.trigger++;
        }
      }
      
      
      
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
  },
  data(){
    const trigger = 1;
    return {
      trigger
    }
  }
}
</script>

<style scoped>

canvas {
  z-index: -10;
}

.btn-container {
  text-align: center;
  padding: 10px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  margin: 0 auto;
  font-family: monospace;
  background-color: #fff;
  color: #333;
  font-weight: 600;
  cursor:pointer;
  outline: none;

}
</style>