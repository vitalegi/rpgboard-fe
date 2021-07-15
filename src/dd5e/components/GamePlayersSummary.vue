<template>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="player in players" :key="player.playerId" cols="12">
        <GamePlayerSummary v-bind:player="player" />
        <DD5eCharacterSheet mode="vertical" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GamePlayerSummary from "@/dd5e/components/GamePlayerSummary.vue";
import DD5eCharacterSheet from "@/dd5e/components/DD5eCharacterSheet.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.GamePlayer");

export default Vue.extend({
  name: "GamePlayersSummary",
  components: {
    DD5eCharacterSheet,
    GamePlayerSummary,
  },
  props: {
    players: Array,
  },
  computed: {},
});
</script>

<style scoped lang="scss"></style>
