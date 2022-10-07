<template>
  <div>
    <!--<Canvas />-->
    <CanvasShader />
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue';
import CanvasShader from './components/CanvasShader.vue'

export default {
  components: {
    Canvas,
    CanvasShader
  }
}
</script>