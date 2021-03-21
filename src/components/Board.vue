<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2"> Ciao </v-col>
      <v-col cols="8">
        <v-stage :width="boardWidth" :height="boardHeight" ref="boardCanvas">
          <v-layer
            v-for="(layer, layerIndex) in layers"
            :key="layerIndex"
            :config="layer.config"
          >
            <generic-shape
              v-for="(shape, shapeIndex) in layer.shapes"
              :key="shapeIndex"
              :component="shape.config.componentName"
              :config="shape.config"
              :dragstart="dragStart"
              :dragmove="dragMove"
              :dragend="dragEnd"
            />
          </v-layer>
        </v-stage>
      </v-col>
      <v-col cols="2"> Ciao </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GenericShape from "@/components/GenericShape.vue";
import { Layer, Shape } from "@/models/BoardContent";
import { Node } from "konva/types/Node";
import { Vector2d } from "konva/types/types";
import { LayerConfig } from "konva/types/Layer";
import { Canvas } from "konva/types/Canvas";
import { Stage, StageConfig } from "konva/types/Stage";
import { ShapeConfig } from "konva/types/Shape";
import { CircleConfig } from "konva/types/shapes/Circle";

import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.Board");

export default Vue.extend({
  name: "Board",
  components: { GenericShape },
  props: {
    boardHeight: Number,
    layers: Array,
  },
  data: () => ({
    boardWidth: 0,
    layerConfig: {
      visible: true,
      draggable: true,
    },
  }),
  methods: {
    getStage(): Stage {
      return (this.$refs.boardCanvas as any).getStage();
    },
    dragStart(event: any) {
      console.log("Start");
    },
    dragMove(event: any) {
      console.log("Move");
    },
    dragEnd(event: any) {
      console.log("End", event);
      console.log(
        `X=${event.evt.clientX} Y=${event.evt.clientY} ID=${event.target.attrs.id}`
      );
    },
    handleResize() {
      logger.info("resize");
      this.boardWidth = (this.$refs.boardCanvas as any).$el.clientWidth;
    },
  },
  created() {
    logger.info("Board creation, remove listeners");
    window.addEventListener("resize", this.handleResize);
    console.log(this.layers);
  },
  mounted() {
    logger.info("Mounted, resize");
    this.handleResize();
  },
  beforeDestroy() {
    logger.info("Board deletion, remove listeners");
    window.removeEventListener("resize", this.handleResize);
  },
});
</script>

<style scoped lang="scss"></style>
