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
            <BoardManager />
          </v-tab-item>
          <v-tab-item key="assets-manager">
            <AssetsManager />
          </v-tab-item>
          <v-tab-item key="players">
            <GamePlayersSummary />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import BoardManager from "@/game/board/components/BoardManager.vue";
import AssetsManager from "@/game/game-assets/components/AssetsManager.vue";
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
  props: { maxHeight: Number },
  data: () => ({
    tab: "board-manager",
    gameId: "",
  }),
  methods: {},
  created() {
    this.gameId = this.$store.getters["game/getGameId"];
  },
});
</script>

<style scoped lang="scss"></style>
