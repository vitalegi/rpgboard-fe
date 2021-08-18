<template>
  <v-stage :width="boardWidth" :height="boardHeight" ref="boardCanvas">
    <v-layer
      v-for="(layer, layerIndex) in shapes"
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
import CustomShape from "../models/BoardContent";
import BoardElement from "@/models/BoardElement";
import BoardContentService from "../services/BoardContentService";
import Container from "typedi";
const logger = factory.getLogger("Game.Board.Components.Board");

export default Vue.extend({
  name: "Board",
  components: { GenericShape },
  props: {
    boardHeight: Number,
    elements: {
      type: Array,
    },
  },
  data: () => ({
    boardWidth: 0,
    lastDragDropNotification: TimeUtil.now(),
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
  }),
  computed: {
    shapes(): CustomShape[] {
      const elements = this.elements as Array<BoardElement>;
      return this.boardContentService.createShapes(elements);
    },
  },
  methods: {
    dragstart(event: any) {
      return;
    },
    dragmove(event: any) {
      if (
        TimeUtil.diffMillis(TimeUtil.now(), this.lastDragDropNotification) > 20
      ) {
        this.lastDragDropNotification = TimeUtil.now();
        this.boardContentService.dragShape(
          event.target.attrs.id,
          event.target.attrs.x,
          event.target.attrs.y,
          false
        );
      }
    },
    dragend(event: any) {
      this.lastDragDropNotification = TimeUtil.now();
      this.boardContentService.dragShape(
        event.target.attrs.id,
        event.target.attrs.x,
        event.target.attrs.y,
        true
      );
    },
    handleResize() {
      logger.debug("resize");
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
