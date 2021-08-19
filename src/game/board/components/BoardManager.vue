<template>
  <v-container>
    <v-card>
      <v-card-text>
        <board-manager-add-image />
        <board-manager-add-group />
      </v-card-text>
    </v-card>
    <board-summary />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import BoardSummary from "./BoardSummary.vue";
import BoardManagerAddImage from "./BoardManagerAddImage.vue";
import BoardManagerAddGroup from "./BoardManagerAddGroup.vue";
const logger = factory.getLogger("Game.Board.Components.BoardManager");

export default Vue.extend({
  name: "BoardManager",
  components: { BoardSummary, BoardManagerAddImage, BoardManagerAddGroup },
  data: () => ({}),
  computed: {},
  methods: {},
});
</script>

<style scoped lang="scss">
.v-card__text {
  text-align: left;
}
</style>
