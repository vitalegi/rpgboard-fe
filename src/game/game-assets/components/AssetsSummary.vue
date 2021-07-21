<template>
  <v-list v-if="assets.length > 0">
    <v-list-item v-for="asset in assets" :key="asset.id">
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
import Asset from "../models/Asset";
const logger = factory.getLogger("Game.GameAssets.Components.AssetsSummary");

export default Vue.extend({
  name: "AssetsSummary",
  components: {},
  props: {},
  data: () => ({}),
  computed: {
    assets(): Array<Asset> {
      return this.$store.getters["assets/assets"];
    },
  },
  methods: {},
});
</script>

<style scoped lang="scss"></style>
