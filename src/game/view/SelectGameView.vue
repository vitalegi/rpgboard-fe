<template>
  <div class="select-game">
    <GraphQLSample />
    <create-game />
    <select-game />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SelectGame from "@/game/components/SelectGame.vue";
import CreateGame from "@/game/components/CreateGame.vue";
import GraphQLSample from "@/game/components/GraphQLSample.vue";

export default Vue.extend({
  name: "SelectGameView",
  components: {
    SelectGame,
    CreateGame,
    GraphQLSample,
  },
});
</script>
