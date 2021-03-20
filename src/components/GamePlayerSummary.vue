<template>
  <v-card>
    <v-card-title>{{ player.name }}</v-card-title>
    <v-card-subtitle>{{ roles }}</v-card-subtitle>
    <v-card-text></v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import GamePlayer from "@/models/GamePlayer";
const logger = factory.getLogger("Components.GamePlayer");

export default Vue.extend({
  name: "GamePlayerSummary",
  props: {
    player: GamePlayer,
  },
  computed: {
    roles() {
      return this.player.roles.join(", ");
    },
  },
});
</script>

<style scoped lang="scss"></style>
