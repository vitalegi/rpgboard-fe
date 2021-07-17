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
          <GameMenus
            :gameId="gameId"
            :maxHeight="internalViewHeight - 50"
          ></GameMenus>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import GameMenus from "@/dd5e/components/GameMenus.vue";
import Board from "@/components/Board.vue";
import GamePlayer from "@/models/GamePlayer";
import { Layer } from "@/models/BoardContent";
import BackendService from "@/services/BackendService";
import BoardContentService from "@/dd5e/services/BoardContentService";
import FileContent from "@/models/FileContent";
import store from "@/store";
import dd5e, { DD5eStoreService } from "../store/DD5eStore";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Views.GameDD5eView");

export default Vue.extend({
  name: "GameDD5eView",
  components: {
    Board,
    GameMenus,
  },
  props: { gameId: String },
  data: () => ({
    boardContent: new Array<Layer>(),
    assets: new Array<FileContent>(),
    tab: "k2",
    viewHeight: 0,
    internalViewHeight: 0,
    backendService: Container.get<BackendService>(BackendService),
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
    dd5eService: Container.get<DD5eStoreService>(DD5eStoreService),
  }),
  methods: {
    updatePlayers(players: Array<GamePlayer>) {
      logger.info(`Update players, count: ${players.length}`);
      this.$store.commit(`${this.moduleName()}/replacePlayers`, players);
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
      const gameRect = gameView.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const distanceFromBody = gameRect.top - bodyRect.top;
      const viewHeight = window.innerHeight - distanceFromBody;
      const internalViewHeight = viewHeight - 25;
      logger.info(
        `Resize view window_height=${Math.round(
          window.innerHeight
        )}, body_top=${Math.round(bodyRect.top)}, view_top=${Math.round(
          gameRect.top
        )}, distance=${Math.round(
          distanceFromBody
        )} => view_height=${Math.round(
          viewHeight
        )}, view_content_height=${Math.round(internalViewHeight)}`
      );
      this.viewHeight = viewHeight;
      this.internalViewHeight = internalViewHeight;
    },
    moduleName(): string {
      return this.dd5eService.moduleName(this.gameId);
    },
  },
  created() {
    logger.info(`Register module ${this.moduleName()}`);
    store.registerModule(`${this.moduleName()}`, dd5e);

    logger.info(`Start game ${this.gameId}`);
    window.addEventListener("resize", this.handleResize);
    this.backendService
      .getGamePlayers(this.gameId)
      .then((players) => this.updatePlayers(players));
    this.boardContent = this.boardContentService.createBoardContent();
  },
  beforeDestroy() {
    logger.info(`Unregister module ${this.moduleName()}`);
    store.unregisterModule(`${this.moduleName()}`);

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
