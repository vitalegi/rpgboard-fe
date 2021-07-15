<template>
  <v-container>
    <file-upload @upload="addAsset" />
    <assets-summary :assets="assets" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import FileUpload from "@/components/FileUpload.vue";
import AssetsSummary from "@/components/AssetsSummary.vue";
import FileContent from "@/models/FileContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("DD5e.Components.AssetsManager");

export default Vue.extend({
  name: "AssetsManager",
  components: {
    AssetsSummary,
    FileUpload,
  },
  props: { gameId: String },
  data: () => ({ assets: new Array<FileContent>() }),
  methods: {
    addAsset(file: FileContent): void {
      logger.info("addAsset");
    },
  },
});
</script>

<style scoped lang="scss"></style>
