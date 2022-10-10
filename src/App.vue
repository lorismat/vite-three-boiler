<template>
  <div>
    <!--<Canvas />-->
    <!--<CanvasShader />-->
    <!--<CanvasShaderNoise />-->
    <CanvasShaderNoiseAndPerlin />
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue';
import CanvasShader from './components/CanvasShader.vue';
import CanvasShaderNoise from './components/CanvasShaderNoise.vue';
import CanvasShaderNoiseAndPerlin from './components/CanvasShaderNoiseAndPerlin.vue';

export default {
  components: {
    Canvas,
    CanvasShader,
    CanvasShaderNoise,
    CanvasShaderNoiseAndPerlin
  }
}
</script>