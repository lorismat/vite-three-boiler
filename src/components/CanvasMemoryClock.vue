<template>
<div>
  <div class="btn-refresh ">
    <button @click="refresh">refresh</button>
  </div>
  <div>
    <canvas id="c1"></canvas>
  </div>
</div>
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

      const colors = ["yellow","purple","red","blue","green","pink","chocolate"];
      console.log(colors.length)
      const color = colors[parseInt(Math.random()*colors.length)]
      // cube
      const colorCube = new THREE.Color(color);
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
    },

    refresh() {

      // useful link
      // https://stackoverflow.com/questions/30359830/how-do-i-clear-three-js-scene
      // official example
      // https://threejs.org/examples/#webgl_test_memory

      // get info from renderer
      // and check if the cleaning is processing
      console.log(renderer.info, renderer.render);

      // pre-cleaning
      scene.traverse(function ( object ) {
        if ( object.geometry ) {
          object.geometry.dispose();
        }
        if ( object.material ) {
          object.material.dispose();
        }
      });

      // final cleaning
      while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
      }

      // renderer cleaning
      renderer.dispose();
      renderer.context=undefined;
      renderer.domElement=undefined;

      // never re animate!
      this.init();
      
      // to init the project after loading texture, see 9 summits project
      

    }

  },
  mounted() {
    window.addEventListener("resize", this.onWindowResize);
    this.init();
    this.animate();
  }
}
</script>

<style scoped>
.btn-refresh {
  position: absolute;
  margin:0 auto;
  z-index: 10;
  margin-left: 100px;
}

</style>