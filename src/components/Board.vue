<template>
  <v-stage :width="boardWidth" :height="boardHeight" ref="boardCanvas">
    <v-layer
      v-for="(layer, layerIndex) in boardContent.layers"
      :key="layerIndex"
      :config="layer.config"
    >
      <generic-shape
        v-for="(shape, shapeIndex) in layer.children"
        :key="shapeIndex"
        :component="shape.config.componentName"
        :children="shape.children"
        :config="shape.config"
        :dragstart="dragstart"
        :dragmove="dragmove"
        :dragend="dragend"
      />
    </v-layer>
  </v-stage>
</template>

<script lang="ts">
import Vue from "vue";
import TimeUtil from "@/utils/TimeUtil";
import GenericShape from "@/components/GenericShape.vue";

import { factory } from "@/utils/ConfigLog4j";
import { BoardContainer } from "@/models/BoardContent";
const logger = factory.getLogger("Components.Board");

export default Vue.extend({
  name: "Board",
  components: { GenericShape },
  props: {
    boardHeight: Number,
    boardContent: BoardContainer,
  },
  data: () => ({
    boardWidth: 0,
    lastDragDropNotification: TimeUtil.now(),
  }),
  methods: {
    dragstart(event: any) {
      return;
    },
    dragmove(event: any) {
      if (
        TimeUtil.diffMillis(TimeUtil.now(), this.lastDragDropNotification) > 100
      ) {
        this.lastDragDropNotification = TimeUtil.now();
        this.$emit("moveShape", event);
      }
    },
    dragend(event: any) {
      this.lastDragDropNotification = TimeUtil.now();
      this.$emit("moveShape", event);
    },
    handleResize() {
      logger.info("resize");
      this.boardWidth = (this.$refs.boardCanvas as any).$el.clientWidth;
    },
  },
  created() {
    logger.info("Board creation, add listeners");
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
