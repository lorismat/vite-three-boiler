<template>
  <div>
    <!--<Canvas />-->
    <!--<CanvasShader />-->
    <CanvasShaderNoise />
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue';
import CanvasShader from './components/CanvasShader.vue';
import CanvasShaderNoise from './components/CanvasShaderNoise.vue';

export default {
  components: {
    Canvas,
    CanvasShader,
    CanvasShaderNoise
  }
}
</script>