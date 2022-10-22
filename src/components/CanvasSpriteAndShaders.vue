<template>
  <canvas id="c1"></canvas>
</template>
n
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera;

let sphere;

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
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;

        void main() {

          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = size * ( 300.0 / -mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;

        }
      `;

      const fragmentShader = `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;

        void main() {

          gl_FragColor = vec4( color * vColor, 1.0 );
          gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

        }
      `;

      const amount = 7000;
      const radius = 200;

      const positions = new Float32Array( amount * 3 );
      const colors = new Float32Array( amount * 3 );
      const sizes = new Float32Array( amount );

      const vertex = new THREE.Vector3();
      const color = new THREE.Color( 0xffffff );

      // camera init position
      camera.position.set(0,0,5);
      camera.lookAt( scene.position );

      for ( let i = 0; i < amount; i ++ ) {
					vertex.x = ( Math.random() * 2 - 1 ) * radius;
					vertex.y = ( Math.random() * 2 - 1 ) * radius;
					vertex.z = ( Math.random() * 2 - 1 ) * radius;
					vertex.toArray( positions, i * 3 );
					color.toArray( colors, i * 3 );
					sizes[ i ] = 100;
				}

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
      geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
      geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

      const material = new THREE.ShaderMaterial( {
        uniforms: {
          color: { value: new THREE.Color( 0xffffff ) },
          pointTexture: { value: new THREE.TextureLoader().load( 'textures/spark1.png' ) }
        },
        vertexShader,
        fragmentShader,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      } );

      sphere = new THREE.Points( geometry, material );
      scene.add( sphere );


      // light
      const lightAmbient = new THREE.AmbientLight(0xffffff, 10);
      const controls = new OrbitControls( camera, renderer.domElement );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

    },

    animate() {
      requestAnimationFrame(this.animate);
      const time = Date.now() * 0.005;

      const geometry = sphere.geometry;
      const attributes = geometry.attributes;
      
      for ( let i = 0; i < attributes.size.array.length; i ++ ) {
        attributes.size.array[ i ] = 4 + 3.9 * Math.sin( 0.1 * i + time );
      }

      attributes.size.needsUpdate = true;


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