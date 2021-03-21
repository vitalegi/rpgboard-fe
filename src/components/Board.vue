<template>
  <v-stage :width="boardWidth" :height="boardHeight" ref="boardCanvas">
    <v-layer
      v-for="(layer, layerIndex) in layers"
      :key="layerIndex"
      :config="layer.config"
    >
      <v-group
        :config="{
          visible: true,
          x: 0,
          y: 0,
          opacity: 1,
          rotation: 0,
          draggable: true,
        }"
        :dragstart="dragStart"
        :dragmove="dragMove"
        :dragend="dragEnd"
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
      </v-group>
    </v-layer>
  </v-stage>
</template>

<script lang="ts">
import Vue from "vue";
import TimeUtil from "@/utils/TimeUtil";
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
    lastDragDropNotification: TimeUtil.now(),
  }),
  methods: {
    dragStart(event: any) {
      return;
    },
    dragMove(event: any) {
      if (
        TimeUtil.diffMillis(TimeUtil.now(), this.lastDragDropNotification) > 100
      ) {
        this.lastDragDropNotification = TimeUtil.now();
        this.$emit("moveShape", event);
      }
    },
    dragEnd(event: any) {
      this.lastDragDropNotification = TimeUtil.now();
      this.$emit("moveShape", event);
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
