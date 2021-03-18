<template>
  <v-container>
    <h1>Canvas</h1>
    <v-stage :config="configKonva" ref="boardCanvas">
      <v-layer>
        <v-circle :config="configCircle"></v-circle>
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Board",

  data: () => ({
    configKonva: {
      width: 500,
      height: 300,
    },
    configCircle: {
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
    config: function () {
      console.log("CANVAS", this.getCanvas());
      console.log("STAGE", this.getStage());
      /*setInterval( () =>{
        const c = this.circles[0];
        c.x -=1;
      }, 200);*/
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
  },
  updated: function () {
    this.config();
  },
  mounted: function () {
    this.config();
  },
});
</script>

<style scoped lang="scss"></style>
