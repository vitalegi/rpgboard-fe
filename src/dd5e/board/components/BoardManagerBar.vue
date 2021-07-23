<template>
  <v-card>
    <v-card-text>
      <board-manager-add-image />
      <board-manager-add-group />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import BoardManagerAddImage from "./BoardManagerAddImage.vue";
import BoardManagerAddGroup from "./BoardManagerAddGroup.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.BoardManagerBar");

export default Vue.extend({
  name: "BoardManagerBar",
  components: { BoardManagerAddImage, BoardManagerAddGroup },
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
