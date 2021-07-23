<template>
  <v-container>
    <board-manager-bar />
    <board-summary :showActions="true" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import BoardSummary from "./BoardSummary.vue";
import BoardManagerBar from "./BoardManagerBar.vue";
const logger = factory.getLogger("Components.BoardManager");

export default Vue.extend({
  name: "BoardManager",
  components: { BoardSummary, BoardManagerBar },
  data: () => ({}),
  computed: {},
  methods: {},
});
</script>
