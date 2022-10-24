<template>
  <div>
    <!--<Canvas />
    <CanvasShader />
    <CanvasShaderNoise />
    <CanvasShaderNoiseAndPerlin />
    <CanvasVertexShader />
    <CanvasVertexShader2 />
    <CanvasLightAndShadows />
    <CanvasSpriteAndShaders />
    <CanvasLoadObject />
    <CanvasLoadObjectDRC />
    <CanvasVertexShaderLightAnimated />
    <CanvasVertexShaderBlender />
    -->
    <CleanCode />
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue';
import CanvasShader from './components/CanvasShader.vue';
import CanvasShaderNoise from './components/CanvasShaderNoise.vue';
import CanvasShaderNoiseAndPerlin from './components/CanvasShaderNoiseAndPerlin.vue';
import CanvasVertexShader from './components/CanvasVertexShader.vue';
import CanvasVertexShader2 from './components/CanvasVertexShader2.vue';
import CanvasVertexShaderBlender from './components/CanvasVertexShaderBlender.vue';
import CanvasLightAndShadows from './components/CanvasLightAndShadows.vue';
import CanvasSpriteAndShaders from './components/CanvasSpriteAndShaders.vue';
import CanvasLoadObject from './components/CanvasLoadObject.vue';
import CanvasLoadObjectDRC from './components/CanvasLoadObjectDRC.vue';
import CleanCode from './components/CleanCode.vue';

import CanvasVertexShaderLightAnimated from './components/CanvasVertexShaderLightAnimated.vue';

export default {
  components: {
    Canvas,
    CanvasShader,
    CanvasShaderNoise,
    CanvasShaderNoiseAndPerlin,
    CanvasVertexShader,
    CanvasVertexShader2,
    CanvasVertexShaderBlender,
    CanvasLightAndShadows,
    CanvasSpriteAndShaders,
    CanvasLoadObject,
    CanvasLoadObjectDRC,
    CanvasVertexShaderLightAnimated,
    CleanCode
  }
}
</script>