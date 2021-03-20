<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2"> Ciao </v-col>
      <v-col cols="8">
        <v-stage :width="boardWidth" :height="boardHeight" ref="boardCanvas">
          <v-layer>
            <v-circle :config="circleConfig"></v-circle>
            <v-circle
              v-for="(circle, index) in circles"
              :key="index"
              :config="circle"
              @dragstart="dragStart"
              @dragmove="dragMove"
              @dragend="dragEnd"
            ></v-circle>
          </v-layer>
        </v-stage>
      </v-col>
      <v-col cols="2"> Ciao </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.Board");

export default Vue.extend({
  name: "Board",

  data: () => ({
    boardWidth: 100,
    boardHeight: 100,
    circleConfig: {
      x: 50,
      y: 50,
      radius: 70,
      fill: "red",
      stroke: "black",
      strokeWidth: 4,
    },
    circles: [
      {
        id: "c1",
        x: 450,
        y: 250,
        radius: 70,
        fill: "pink",
        stroke: "black",
        strokeWidth: 4,
      },
      {
        id: "c2",
        x: 70,
        y: 50,
        radius: 70,
        fill: "orange",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
      },
      {
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
    getCanvas() {
      return this.$refs.boardCanvas as any;
    },
    getStage() {
      return this.getCanvas().getStage();
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
      this.boardHeight = 400;
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
