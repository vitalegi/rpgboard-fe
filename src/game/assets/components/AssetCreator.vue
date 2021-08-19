<template>
  <v-form>
    <file-upload @upload="updateFile" />
    <v-text-field
      v-model="name"
      label="Name"
      outlined
      clearable
      :rules="required"
    ></v-text-field>
    <v-btn @click="upload()" :disabled="!canUpload"> Upload </v-btn>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import FileContent from "../models/FileContent";
import AssetService from "../services/AssetService";
import FileUpload from "./FileUpload.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Assets.Components.AssetCreator");

export default Vue.extend({
  name: "AssetCreator",
  components: { FileUpload },
  props: {
    assets: Array,
  },
  data: () => ({
    required: [(v: string) => !!v || "Required field"],
    name: "",
    file: new FileContent(),
    fileReady: false,
    overlay: false,
    assetService: Container.get<AssetService>(AssetService),
  }),
  computed: {
    canUpload(): boolean {
      return this.name.length > 0 && this.fileReady;
    },
  },
  methods: {
    gameId(): string {
      return this.$store.getters["game/getGameId"];
    },
    getAssets(): Array<FileContent> {
      return this.assets as Array<FileContent>;
    },
    updateFile(file: FileContent | null) {
      if (file === null) {
        this.fileReady = false;
        return;
      }
      logger.info(`New file ${file.name}`);
      this.name = file.name;
      this.file = file;
      this.fileReady = true;
    },
    async upload(): Promise<void> {
      try {
        this.overlay = true;
        await this.assetService.addAsset(
          this.gameId(),
          this.name,
          this.file.content
        );
      } finally {
        this.overlay = false;
      }
    },
  },
});
</script>

<style scoped lang="scss"></style>
