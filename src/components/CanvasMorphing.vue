<template>
  <canvas id="c1"></canvas>
</template>

<script>

// blender morphing
// https://www.youtube.com/watch?v=pimbaEE9cjQ
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let stats;
let scene, renderer, camera, clock;

let points;

let sign = 1;
const speed = 0.5;

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

      clock = new THREE.Clock();

      let canvas = document.getElementById("c1");
      renderer = new THREE.WebGLRenderer({ antialias : true, canvas});
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.set(0,0,50);
      camera.lookAt( scene.position );
      stats = new Stats();
      document.body.appendChild( stats.dom );
      const controls = new OrbitControls( camera, renderer.domElement );

      const vertices = [];
      const spherePositions = [];

      for ( let i = 0; i < 10000; i ++ ) {
        const x = Math.random()*4;
        const y = Math.random()*4;
        const z = Math.random()*4;

        const angle = Math.random() * Math.PI * 2;

        const x2 = 20 * Math.sin(angle);
        const z2 = 0;
        const y2 = 20 * Math.cos(angle);

        vertices.push( x, y, z );
        spherePositions.push(x2, y2, z2);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
      geometry.morphAttributes.position = [];
      geometry.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( spherePositions, 3 );

      const material = new THREE.PointsMaterial( {
        sizeAttenuation: false,
        size: 10,
        map: new THREE.TextureLoader().load( 'textures/spark1.png' ),
        alphaTest: 0.5,
        morphTargets: true
      } );

      points = new THREE.Points( geometry, material );
      points.morphTargetInfluences[ 0 ] = 0;

      scene.add( points );

    },

    animate() {
      requestAnimationFrame(this.animate);
      const delta = clock.getDelta();
      
      if ( points !== undefined ) {
        const step = delta * speed;
        points.morphTargetInfluences[ 0 ] = points.morphTargetInfluences[ 0 ] + step * sign;
        if ( points.morphTargetInfluences[ 0 ] <= 0 || points.morphTargetInfluences[ 0 ] >= 1 ) {
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