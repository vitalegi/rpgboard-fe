<template>
  <div class="game">
    <board></board>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Board from "@/components/Board.vue";

export default Vue.extend({
  name: "GameView",
  components: {
    Board,
  },
});
</script>
