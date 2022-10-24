<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let stats;
let scene, renderer, camera;
let monkey, material;

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

      const vertexShader = `
        varying vec2 vUv;
        varying float distFromCenter;

        varying vec3 vNormal;
        uniform float time;

        float random (in float x) {
          return fract(sin(x)*100000.0);
        }

        void main () {
          vNormal = normal;

          float rand = random(normal.y*normal.x);

          vec3 offset = position;
          float dist = 0.5;
          offset.xyz += normal * dist * abs(sin(time*0.1)) * rand * 7.;

          distFromCenter = distance(position.xyz, vec3(0.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(offset, 1.0);
        }
      `;

      const fragmentShader = `
        varying vec2 vUv;
        varying float distFromCenter;
        void main () {
          gl_FragColor = vec4(vec3(0.5 + distFromCenter/2.,distFromCenter,distFromCenter/2.), 1.0);
        }
      `;

      // GLTF Object 
      const loader = new GLTFLoader();

      loader.load(
        "objects/monkey_high.glb",
        function ( gltf ) {
            monkey = gltf.scene.children[0];

            monkey.name = "monkey";
            monkey.scale.setScalar(3);

            material = new THREE.ShaderMaterial({
              vertexShader,
              fragmentShader,
              uniforms: {
                time: { value: 0 },
              }
            })

            monkey.material = material;
            scene.add( monkey );
            
        },
      );

      // camera init position
      camera.position.set(0,0,10);
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
      material.uniforms.time.value = time;

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