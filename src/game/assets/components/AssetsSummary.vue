<template>
  <v-list v-if="assets.length > 0">
    <v-list-item v-for="asset in assets" :key="asset.assetId">
      <v-list-item-action v-if="selectable">
        <v-btn elevation="2" icon @click="select(asset.assetId)">
          <v-icon>mdi-plus-box</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        {{ asset.name }}
      </v-list-item-content>
      <v-list-item-avatar>
        <v-img :src="assetContentSrc(asset)"></v-img>
      </v-list-item-avatar>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";
import Asset from "../models/Asset";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Assets.Components.AssetsSummary");

export default Vue.extend({
  name: "AssetsSummary",
  components: {},
  props: {
    selectable: { type: Boolean, default: false },
  },
  data: () => ({}),
  computed: {
    assets(): Array<Asset> {
      const assets = this.$store.getters["assets/assets"] as Asset[];
      return assets.sort((a, b) => {
        if (a.name !== b.name) {
          return a.name > b.name ? 1 : -1;
        }
        return a.assetId > b.assetId ? 1 : -1;
      });
    },
  },
  methods: {
    select(id: string): void {
      this.$emit("select", id);
    },
    assetContentSrc(asset: Asset): string {
      return `${process.env.VUE_APP_BACKEND}/content/game/${asset.gameId}/asset/${asset.assetId}`;
    },
  },
});
</script>

<style scoped lang="scss"></style>
