<template>
  <v-card id="game" ref="gameView" :height="viewHeight">
    <v-container fluid>
      <v-row class="child-flex">
        <v-col cols="12" md="8" lg="9">
          <board
            :boardHeight="internalViewHeight"
            :layers="boardContent"
            @moveShape="move"
          ></board>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <v-card color="basil" :max-height="internalViewHeight">
            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="basil"
              grow
            >
              <v-tab key="board-manager">Board</v-tab>
              <v-tab key="assets-manager">Assets</v-tab>
              <v-tab key="players">Players</v-tab>
            </v-tabs>
            <v-card
              color="basil"
              flat
              class="overflow-y-auto"
              :max-height="internalViewHeight"
            >
              <v-card-text>
                <v-tabs-items v-model="tab">
                  <v-tab-item key="board-manager">
                    <board-manager :layers="boardContent" />
                  </v-tab-item>
                  <v-tab-item key="assets-manager">
                    <file-upload @upload="addAsset" />
                    <assets-summary :assets="assets" />
                  </v-tab-item>
                  <v-tab-item key="players">
                    <game-players-summary v-bind:players="gamePlayers" />
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-speed-dial
      v-model="fab"
      direction="left"
      bottom
      right
      fixed
      transition="slide-x-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab fixed right bottom>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-account-circle </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import FileUpload from "@/components/FileUpload.vue";
import Board from "@/components/Board.vue";
import AssetsSummary from "@/components/AssetsSummary.vue";
import BoardManager from "@/components/BoardManager.vue";
import GamePlayersSummary from "@/components/GamePlayersSummary.vue";
import { Container } from "typedi";
import BackendService from "@/services/BackendService";
import GamePlayer from "@/models/GamePlayer";
import ArrayUtil from "@/utils/ArrayUtil";
import random from "@/utils/RandomUtil";
import { Shape, Layer } from "@/models/BoardContent";
import { factory } from "@/utils/ConfigLog4j";
import { Vector2d } from "konva/types/types";
import FileContent from "@/models/FileContent";
const logger = factory.getLogger("Views.GameDD5eView");

export default Vue.extend({
  name: "GameDD5eView",
  components: {
    Board,
    GamePlayersSummary,
    BoardManager,
    AssetsSummary,
    FileUpload,
  },
  props: { gameId: String },
  data: () => ({
    gamePlayers: new Array<GamePlayer>(),
    boardContent: new Array<Layer>(),
    assets: new Array<FileContent>(),
    tab: "k2",
    fab: false,
    viewHeight: 0,
    internalViewHeight: 0,
    backendService: Container.get<BackendService>(BackendService),
  }),
  methods: {
    updatePlayers(players: Array<GamePlayer>) {
      logger.info(`Update players, count: ${players.length}`);
      ArrayUtil.removeAll(this.gamePlayers);
      players.forEach((player) => this.gamePlayers.push(player));
    },
    move(event: any) {
      logger.info(
        `X=${event.evt.clientX} Y=${event.evt.clientY} ID=${event.target.attrs.id}`
      );
    },
    addAsset(file: FileContent): void {
      this.assets.push(file);
    },
    handleResize() {
      const gameView = (this.$refs.gameView as any).$el;
      const rect = gameView.getBoundingClientRect();
      const remainingHeight = window.innerHeight - rect.top;
      this.viewHeight = remainingHeight;
      this.internalViewHeight = this.viewHeight - 25;
    },
  },
  created() {
    logger.info(`Start game`);
    window.addEventListener("resize", this.handleResize);
    this.backendService
      .getGamePlayers(this.gameId)
      .then((players) => this.updatePlayers(players));

    const layer = new Layer({ visible: true, draggable: true });
    this.boardContent.push(layer);
    layer.shapes.push(
      new Shape({
        componentName: "v-rect",
        name: "background",
        x: 2,
        y: 2,
        width: 800,
        height: 396,
        stroke: "black",
        strokeWidth: 4,
      })
    );

    for (let i = 0; i < 20; i++) {
      layer.shapes.push(
        new Shape({
          componentName: "v-circle",
          id: `ran_${i}`,
          x: random(500) + 100,
          y: random(300) + 100,
          radius: random(50) + 10,
          fill: "red",
          stroke: "black",
          strokeWidth: 4,
        })
      );
    }
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
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    logger.info("Mounted, resize");
    this.handleResize();
  },
});
</script>

<style scoped lang="scss">
#game .v-speed-dial__list {
  position: absolute;
}

#game .v-btn--floating {
  position: relative;
}
</style>
