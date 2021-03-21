<template>
  <div class="game">
    <v-container fluid>
      <v-row>
        <v-col cols="9">
          <board
            :boardHeight="400"
            :layers="boardContent"
            @moveShape="move"
          ></board>
        </v-col>
        <v-col cols="3">
          <v-card color="basil">
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
            <v-tabs-items v-model="tab">
              <v-tab-item key="board-manager">
                <v-card color="basil" flat height="400" class="overflow-y-auto">
                  <v-card-text>
                    <board-manager :layers="boardContent" />
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="assets-manager">
                <v-card color="basil" flat height="400" class="overflow-y-auto">
                  <v-card-text>
                    <file-upload @upload="addAsset" />
                    <assets-summary :assets="assets" />
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="players">
                <v-card color="basil" flat height="400" class="overflow-y-auto">
                  <v-card-text>
                    <game-players-summary v-bind:players="gamePlayers" />
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FileUpload from "@/components/FileUpload.vue";
import Board from "@/components/Board.vue";
import AssetsSummary from "@/components/AssetsSummary.vue";
import BoardManager from "@/components/BoardManager.vue";
import GamePlayersSummary from "@/components/GamePlayersSummary.vue";
import backendService from "@/services/BackendService";
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
  },
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
  },
});
</script>
