<template>
  <v-container>
    <asset-creator />
    <assets-summary />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import AssetCreator from "./AssetCreator.vue";
import AssetsSummary from "./AssetsSummary.vue";
import FileContent from "../models/FileContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Assets.Components.AssetsManager");

export default Vue.extend({
  name: "AssetsManager",
  components: {
    AssetsSummary,
    AssetCreator,
  },
  data: () => ({ assets: new Array<FileContent>() }),
  methods: {},
});
</script>

<style scoped lang="scss"></style>
