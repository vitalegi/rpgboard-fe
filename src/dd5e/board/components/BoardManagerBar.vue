<template>
  <v-card>
    <v-card-text>
      <board-manager-add />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import BoardManagerAdd from "./BoardManagerAdd.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.BoardManagerBar");

export default Vue.extend({
  name: "BoardManagerBar",
  components: { BoardManagerAdd },
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
