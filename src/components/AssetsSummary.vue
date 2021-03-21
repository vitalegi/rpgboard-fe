<template>
  <v-list v-if="assets.length > 0">
    <v-list-item v-for="(asset, assetIndex) in getAssets()" :key="assetIndex">
      <v-list-item-content>
        {{ asset.name }}
      </v-list-item-content>
      <v-list-item-avatar>
        <v-img :src="asset.content"></v-img>
      </v-list-item-avatar>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import FileContent from "@/models/FileContent";
const logger = factory.getLogger("Components.AssetsSummary");

export default Vue.extend({
  name: "AssetsSummary",
  components: {},
  props: {
    assets: Array,
  },
  data: () => ({}),
  methods: {
    getAssets(): Array<FileContent> {
      return this.assets as Array<FileContent>;
    },
  },
});
</script>

<style scoped lang="scss"></style>
