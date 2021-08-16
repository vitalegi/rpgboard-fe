<template>
  <v-card id="game" ref="gameView" :min-height="viewHeight">
    <v-container fluid>
      <v-row class="child-flex">
        <v-col cols="12" md="6" lg="8">
          <board
            :boardHeight="internalViewHeight"
            :boardContent="boardContent"
            @moveShape="move"
          ></board>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <GameMenus :maxHeight="internalViewHeight - 50"></GameMenus>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import GameMenus from "@/dd5e/components/GameMenus.vue";
import Board from "@/game/board/components/Board.vue";
import GamePlayer from "@/models/GamePlayer";
import { BoardContainer } from "@/game/board/models/BoardContent";
import BackendService from "@/services/BackendService";
import BoardContentService from "@/game/board/services/BoardContentService";
import store from "@/store";
import dd5e, { DD5eStoreService } from "../store/DD5eStore";
import WebSocketClient from "@/services/WebSocketClient";
import { default as VueEventBus } from "@/utils/EventBus";
import { factory } from "@/utils/ConfigLog4j";
import { default as BoardModel } from "@/models/Board";
const logger = factory.getLogger("Views.GameDD5eView");

export default Vue.extend({
  name: "GameDD5eView",
  components: {
    Board,
    GameMenus,
  },
  props: { gameId: String },
  data: () => ({
    viewHeight: 0,
    internalViewHeight: 0,
    backendService: Container.get<BackendService>(BackendService),
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
    dd5eService: Container.get<DD5eStoreService>(DD5eStoreService),
    webSocket: Container.get<WebSocketClient>(WebSocketClient),
  }),
  computed: {
    boardContent(): BoardContainer {
      return this.$store.getters[`board/container`];
    },
  },
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
    handleResize() {
      const gameView = (this.$refs.gameView as any).$el;
      const gameRect = gameView.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const distanceFromBody = gameRect.top - bodyRect.top;
      const viewHeight = window.innerHeight - distanceFromBody;
      const internalViewHeight = viewHeight - 25;
      logger.debug(
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
    playersHandler(body: any): void {
      console.log("handle players", body);
    },
    boardsHandler(body: any): void {
      console.log("handle board", body);
    },
    async loadBoard(board: BoardModel) {
      const elements = await this.backendService.getBoardElements(
        board.boardId
      );
      await this.boardContentService.init(board, elements);
    },
    async loadAssets() {
      const assets = await this.backendService.getAssets(this.gameId);
      logger.info(`Loaded ${assets.length} assets`);
      store.commit("assets/reset", assets);
      //assets.forEach((asset) => store.commit("assets/addAsset", asset));
    },
  },
  async created() {
    await this.webSocket.init(() => {
      this.webSocket.register(`external.outgoing.game.${this.gameId}`);
      logger.info(`websocket listener is registered`);
    });

    // setup stores
    logger.info(`Register gameId ${this.gameId}`);
    this.$store.commit("game/selectGame", this.gameId);
    logger.info(`Register module ${this.moduleName()}`);
    store.registerModule(`${this.moduleName()}`, dd5e);

    // setup page resizer
    logger.info(`Start game ${this.gameId}`);
    window.addEventListener("resize", this.handleResize);

    VueEventBus.$on(`${this.moduleName()}.players`, this.playersHandler);
    VueEventBus.$on(`${this.moduleName()}.boards`, this.boardsHandler);
  },
  beforeDestroy() {
    logger.info(`Unregister module ${this.moduleName()}`);
    store.unregisterModule(`${this.moduleName()}`);

    logger.info("Leaving game");
    window.removeEventListener("resize", this.handleResize);

    logger.info("Unregister websocket");
    this.webSocket.unregister(`external.outgoing.game.${this.gameId}`);

    logger.info(`Unregister EventBus listeners`);
    VueEventBus.$off(`${this.moduleName()}.players`, this.playersHandler);
    VueEventBus.$off(`${this.moduleName()}.boards`, this.boardsHandler);
  },
  async mounted() {
    logger.debug("Mounted, resize");
    this.handleResize();

    // setup players
    this.backendService
      .getGamePlayers(this.gameId)
      .then((players) => this.updatePlayers(players));

    // setup board content
    const activeBoard = await this.backendService.getActiveBoard(this.gameId);
    if (activeBoard) {
      this.loadBoard(activeBoard);
    }

    // setup assets
    this.loadAssets();
  },
});
</script>

<style scoped lang="scss"></style>
