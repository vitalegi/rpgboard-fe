<template>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="player in players" :key="player.playerId" :cols="2">
        <game-player-summary v-bind:player="player" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GamePlayerSummary from "@/components/GamePlayerSummary.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.GamePlayer");

export default Vue.extend({
  name: "GamePlayersSummary",
  components: {
    GamePlayerSummary,
  },
  props: {
    players: Array,
  },
});
</script>

<style scoped lang="scss"></style>
