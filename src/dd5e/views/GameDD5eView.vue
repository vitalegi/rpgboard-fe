<template>
  <v-card id="game" ref="gameView" :min-height="viewHeight">
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
          <GameMenus :gameId="gameId"></GameMenus>
        </v-col>
      </v-row>
    </v-container>
    <DD5eCharacterSheet mode="vertical" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import DD5eCharacterSheet from "@/dd5e/character-sheet/components/DD5eCharacterSheet.vue";
import GameMenus from "@/dd5e/components/GameMenus.vue";
import Board from "@/components/Board.vue";
import GamePlayer from "@/models/GamePlayer";
import ArrayUtil from "@/utils/ArrayUtil";
import { Layer } from "@/models/BoardContent";
import BackendService from "@/services/BackendService";
import BoardContentService from "@/dd5e/services/BoardContentService";
import FileContent from "@/models/FileContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Views.GameDD5eView");

export default Vue.extend({
  name: "GameDD5eView",
  components: {
    Board,
    GameMenus,
    DD5eCharacterSheet,
  },
  props: { gameId: String },
  data: () => ({
    gamePlayers: new Array<GamePlayer>(),
    boardContent: new Array<Layer>(),
    assets: new Array<FileContent>(),
    tab: "k2",
    viewHeight: 0,
    internalViewHeight: 0,
    backendService: Container.get<BackendService>(BackendService),
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
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
    this.boardContent = this.boardContentService.createBoardContent();
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

<style scoped lang="scss"></style>
