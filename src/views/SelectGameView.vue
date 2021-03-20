<template>
  <div class="select-game">
    <create-game />
    <select-game />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SelectGame from "@/components/SelectGame.vue";
import CreateGame from "@/components/CreateGame.vue";

export default Vue.extend({
  name: "SelectGameView",
  components: {
    SelectGame,
    CreateGame,
  },
});
</script>
