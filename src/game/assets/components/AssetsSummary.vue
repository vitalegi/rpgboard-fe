<template>
  <div>
    <tree-menu :elements="items">
      <template v-slot:title="slotProps">
        <span>
          <v-avatar size="32">
            <img
              :src="assetContentSrc(slotProps.element.node)"
              :alt="slotProps.element.node.name"
            />
          </v-avatar>
        </span>
        <span>
          {{ slotProps.element.node.name }}
        </span>
      </template>
      <template v-slot:body="slotProps"> body {{ slotProps }} </template>
      <template v-slot:append="slotProps" v-if="selectable">
        <v-btn
          elevation="2"
          icon
          @click="select(slotProps.element.node.assetId)"
        >
          <v-icon>mdi-plus-box</v-icon>
        </v-btn>
      </template>
    </tree-menu>
    <!--
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
    </v-list>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Asset from "../models/Asset";
import TreeMenu from "@/components/TreeMenu.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Assets.Components.AssetsSummary");

export default Vue.extend({
  name: "AssetsSummary",
  components: { TreeMenu },
  props: {
    selectable: { type: Boolean, default: false },
    updateable: { type: Boolean, default: false },
  },
  data: () => ({}),
  computed: {
    items(): Array<Record<string, unknown>> {
      return (this.$store.getters["assets/assets"] as Asset[])
        .sort((a, b) => {
          if (a.name !== b.name) {
            return a.name > b.name ? 1 : -1;
          }
          return a.assetId > b.assetId ? 1 : -1;
        })
        .map((a) => {
          return {
            id: a.assetId,
            node: a,
            children: [],
          };
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
