<template>
  <div class="select-game">
    <select-game></select-game>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SelectGame from "@/components/SelectGame.vue";

export default Vue.extend({
  name: "SelectGameView",
  components: {
    SelectGame,
  },
});
</script>
