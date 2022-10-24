<template>
  <canvas id="c1"></canvas>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats;
let scene, renderer, camera, sphere;
let materialSphere;
let geometrySphere;

// light, shadows and shaders
// discussion
// https://discourse.threejs.org/t/shadow-with-vertex-shader/25468/5
// official example
// https://threejs.org/examples/#webgl_shadowmap_pointlight
// beware: difference between MeshDistanceMaterial (for pointlights) and customDepthMaterial (other lights)
// other lights:
// .customDepthMaterial : Material
// Custom depth material to be used when rendering to the depth map. Can only be used in context of meshes. When shadow-casting with a DirectionalLight or SpotLight, if you are modifying vertex positions in the vertex shader you must specify a customDepthMaterial for proper shadows. Default is undefined. 

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

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize(window.innerWidth, window.innerHeight);

      // plane surface to receive shadow

      const planeSize = 80;
      const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;
      plane.rotation.x = Math.PI/2;
      scene.add(plane);

      const radius = 10; 
      geometrySphere = new THREE.SphereGeometry(radius,32,32);

      geometrySphere.needsUpdate = true;

      const vertexShader = `

        varying vec2 vUv;
        uniform float time;
        attribute float aRandom;
        
        void main () {
          vUv = uv;
          vec3 newPosition = position;

          newPosition.x += abs(sin(time * aRandom)) * 9.0;
          newPosition.y += abs(cos(time * aRandom)) * 9.0;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `;

      const fragmentShader = `

        #define TWO_PI 6.28318530718

        varying vec2 vUv;
        uniform float time;

        // color transform
        vec3 hsb2rgb( in vec3 c ){
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                            6.0)-3.0)-1.0,
                            0.0,
                            1.0 );
          rgb = rgb*rgb*(3.0-2.0*rgb);
          return c.z * mix( vec3(1.0), rgb, c.y);
        }

        void main () {          
          vec2 st = vUv;

          // Use polar coordinates instead of cartesian
          vec2 toCenter = vec2(0.5)-st;
          float angle = atan(toCenter.y,toCenter.x);
          float radius = length(toCenter)*2.0;

          vec3 color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

          gl_FragColor = vec4(color, 1.0);
        
        }
      `;

      
      materialSphere = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
          uDisplacementScale: { value: 0.3 },
        },
        side: THREE.DoubleSide,
      });

      // store the number of vertices
      const countVertices = geometrySphere.attributes.position.count;
      const randoms = new Float32Array(countVertices);
      for (let i = 0; i<countVertices; i++) {
        randoms[i] = Math.random() * 2 - 1;
      }

      geometrySphere.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

      sphere = new THREE.Mesh(geometrySphere, materialSphere);
      
      sphere.position.y = radius+2;
      

      // custom depth material
      sphere.customDepthMaterial = new THREE.MeshDepthMaterial( {
          depthPacking: THREE.RGBADepthPacking,
					vertexShader,
          fragmentShader,
          uniforms: {
            time: { value: 0 },
            uDisplacementScale: { value: 7.0 },
          },
          map: texture2,
          alphaTest: 0.5

				} );

      console.log(sphere.customDepthMaterial);

      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere);

      // camera init position
      camera.position.set(0,60,60);
      camera.lookAt( scene.position );

      const controls = new OrbitControls( camera, renderer.domElement );

      // testing shadows
      const geometry = new THREE.BoxGeometry( 1,1,1 );
      const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
      const cube = new THREE.Mesh( geometry, material );
      cube.scale.setScalar(10);
      // cube.receiveShadow = true;
      cube.castShadow = true;
      cube.position.set(30, 10, -3);
      // scene.add( cube );

      // lightning
      /*
      const pointLight = new THREE.PointLight( 0xffffff, 2, 100 );
      pointLight.position.set( 30, 40, -30 );
      pointLight.castShadow = true;
      scene.add( pointLight );

      const sphereSize = 5;
      const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
      scene.add( pointLightHelper );
      */

      const spotLight = new THREE.SpotLight( 0xffffff );
      spotLight.intensity = 5;
      spotLight.position.set( 100, 200, -100 );
      spotLight.lookAt.scene;
      spotLight.castShadow = true;
      scene.add( spotLight );

      const spotLightHelper = new THREE.SpotLightHelper( spotLight );
      scene.add( spotLightHelper );

      // STATS
      stats = new Stats();
      document.body.appendChild( stats.dom );

    },

    animate() {
      requestAnimationFrame(this.animate);

      const time = - performance.now() * 0.0005;
      materialSphere.uniforms.time.value = time;

      
      geometrySphere.computeVertexNormals();


      // sphere.scale.setScalar(Math.sin(time*0.1)*2);

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