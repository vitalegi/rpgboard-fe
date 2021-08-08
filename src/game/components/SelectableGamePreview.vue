<template>
  <v-card>
    <v-card-title>
      {{ game.name }}
    </v-card-title>
    <v-card-text style="text-align: left">
      Game: {{ game.type }}<br />
      Status: {{ game.status }}
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="select(game.id)">Join</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Game from "@/models/Game";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.SelectableGamePreview");

export default Vue.extend({
  name: "SelectableGamePreview",
  props: { game: { type: Game } },

  data: () => ({}),
  computed: {},
  methods: {
    select(gameId: string): void {
      this.$emit("select", gameId);
    },
  },
});
</script>

<style scoped lang="scss"></style>
