<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2"> Ciao </v-col>
      <v-col cols="8">
        <v-stage :width="boardWidth" :height="boardHeight" ref="boardCanvas">
          <v-layer :config="layerConfig">
            <generic-shape
              v-for="(shape, index) in shapes"
              :key="index"
              :component="shape.componentName"
              :config="shape"
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
import { Node } from "node_modules/konva/types/Node";
import { Vector2d } from "node_modules/konva/types/types";
import { LayerConfig } from "node_modules/konva/types/Layer";
import { Canvas } from "node_modules/konva/types/Canvas";
import { Stage, StageConfig } from "node_modules/konva/types/Stage";
import { ShapeConfig } from "node_modules/konva/types/Shape";
import { CircleConfig } from "node_modules/konva/types/shapes/Circle";

import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.Board");

export default Vue.extend({
  name: "Board",
  components: { GenericShape },
  props: {
    boardHeight: Number,
  },
  data: () => ({
    boardWidth: 0,
    layerConfig: {
      visible: true,
      draggable: true,
    },
    shapes: [
      {
        componentName: "v-rect",
        x: 2,
        y: 2,
        width: 800,
        height: 396,
        stroke: "black",
        strokeWidth: 4,
      },
      {
        componentName: "image-shape",
        x: 200,
        y: 22,
        width: 30,
        height: 30,
        image: "https://vuejs.org/images/logo.png",
        draggable: true,
      },
      {
        componentName: "v-circle",
        id: "c1",
        x: 450,
        y: 250,
        radius: 70,
        fill: "pink",
        stroke: "black",
        strokeWidth: 4,
      },
      {
        componentName: "v-circle",
        id: "c2",
        x: 70,
        y: 50,
        radius: 70,
        fill: "orange",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
        dragBoundFunc(position: Vector2d): Vector2d {
          let x = position.x;
          let y = position.y;
          if (x < 0) {
            x = 0;
          }
          if (x > 500) {
            x = 500;
          }
          if (y < 70) {
            y = 70;
          }
          if (y > 100) {
            y = 100;
          }

          return { x: x, y: y };
        },
      },
      {
        componentName: "v-circle",
        id: "c3",
        x: 90,
        y: 60,
        radius: 50,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
      },
    ],
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
