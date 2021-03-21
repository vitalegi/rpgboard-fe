<template>
  <div class="game">
    {{ gameId }}
    <game-players-summary v-bind:players="gamePlayers" />
    <board :boardHeight="400" :layers="boardContent"></board>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Board from "@/components/Board.vue";
import GamePlayersSummary from "@/components/GamePlayersSummary.vue";
import backendService from "@/services/BackendService";
import GamePlayer from "@/models/GamePlayer";
import ArrayUtil from "@/utils/ArrayUtil";
import { Shape, Layer } from "@/models/BoardContent";
import { factory } from "@/utils/ConfigLog4j";
import { Vector2d } from "konva/types/types";
const logger = factory.getLogger("Views.GameDD5eView");

export default Vue.extend({
  name: "GameDD5eView",
  components: {
    Board,
    GamePlayersSummary,
  },
  data: () => ({
    gamePlayers: new Array<GamePlayer>(),
    boardContent: new Array<Layer>(),
  }),
  methods: {
    updatePlayers(players: Array<GamePlayer>) {
      logger.info(`Update players, count: ${players.length}`);
      ArrayUtil.removeAll(this.gamePlayers);
      players.forEach((player) => this.gamePlayers.push(player));
    },
  },
  props: { gameId: String },
  created() {
    logger.info(`Start game`);
    backendService
      .getGamePlayers(this.gameId)
      .then((players) => this.updatePlayers(players));

    const layer = new Layer({ visible: true, draggable: true });
    this.boardContent.push(layer);
    layer.shapes.push(
      new Shape({
        componentName: "v-rect",
        x: 2,
        y: 2,
        width: 800,
        height: 396,
        stroke: "black",
        strokeWidth: 4,
      })
    );

    layer.shapes.push(
      new Shape({
        componentName: "image-shape",
        x: 200,
        y: 22,
        width: 30,
        height: 30,
        image: "https://vuejs.org/images/logo.png",
        draggable: true,
      })
    );
    layer.shapes.push(
      new Shape({
        componentName: "v-circle",
        id: "c1",
        x: 450,
        y: 250,
        radius: 70,
        fill: "pink",
        stroke: "black",
        strokeWidth: 4,
      })
    );
    layer.shapes.push(
      new Shape({
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
      })
    );
    layer.shapes.push(
      new Shape({
        componentName: "v-circle",
        id: "c3",
        x: 90,
        y: 60,
        radius: 50,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
      })
    );
  },
  beforeDestroy() {
    logger.info("Leaving game");
  },
});
</script>
