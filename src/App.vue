<template>
  <div>
    <!--<Canvas />-->
    <!--<CanvasShader />-->
    <!--<CanvasShaderNoise />-->
    <!--<CanvasShaderNoiseAndPerlin />-->
    <!--<CanvasShaderVertex />-->
    <CanvasLightAndShadows />
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue';
import CanvasShader from './components/CanvasShader.vue';
import CanvasShaderNoise from './components/CanvasShaderNoise.vue';
import CanvasShaderNoiseAndPerlin from './components/CanvasShaderNoiseAndPerlin.vue';
import CanvasShaderVertex from './components/CanvasShaderVertex.vue';
import CanvasLightAndShadows from './components/CanvasLightAndShadows.vue';



export default {
  components: {
    Canvas,
    CanvasShader,
    CanvasShaderNoise,
    CanvasShaderNoiseAndPerlin,
    CanvasShaderVertex,
    CanvasLightAndShadows
  }
}
</script>