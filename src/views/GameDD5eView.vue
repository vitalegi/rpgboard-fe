<template>
  <div class="game">
    {{ gameId }}
    <game-players-summary v-bind:players="gamePlayers" />
    <board></board>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Board from "@/components/Board.vue";
import GamePlayersSummary from "@/components/GamePlayersSummary.vue";
import backendService from "@/services/BackendService";
import GamePlayer from "@/models/GamePlayer";
import ArrayUtil from "@/utils/ArrayUtil";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Views.GameDD5eView");

export default Vue.extend({
  name: "GameDD5eView",
  components: {
    Board,
    GamePlayersSummary,
  },
  data: () => ({
    gamePlayers: new Array<GamePlayer>(),
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
  },
  beforeDestroy() {
    logger.info("Leaving game");
  },
});
</script>
