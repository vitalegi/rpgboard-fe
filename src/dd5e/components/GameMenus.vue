<template>
  <v-card :max-height="maxHeight">
    <v-tabs v-model="tab" background-color="transparent" grow>
      <v-tab key="board-manager">Board</v-tab>
      <v-tab key="assets-manager">Assets</v-tab>
      <v-tab key="players">Players</v-tab>
    </v-tabs>
    <v-card flat class="overflow-y-auto" :max-height="maxHeight">
      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item key="board-manager">
            <BoardManager :gameId="gameId" />
          </v-tab-item>
          <v-tab-item key="assets-manager">
            <AssetsManager :gameId="gameId" />
          </v-tab-item>
          <v-tab-item key="players">
            <GamePlayersSummary :gameId="gameId" />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import BoardManager from "@/components/BoardManager.vue";
import AssetsManager from "@/dd5e/components/AssetsManager.vue";
import GamePlayersSummary from "@/dd5e/components/GamePlayersSummary.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("DD5e.Components.GameMenus");

export default Vue.extend({
  name: "GameMenus",
  components: {
    GamePlayersSummary,
    BoardManager,
    AssetsManager,
  },
  props: { gameId: String, maxHeight: Number },
  data: () => ({
    tab: "board-manager",
  }),
  methods: {},
});
</script>

<style scoped lang="scss"></style>
