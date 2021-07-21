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
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import FileContent from "../models/FileContent";
import AssetService from "../services/AssetService";
import FileUpload from "@/components/FileUpload.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.GameAssets.Components.AssetCreator");

export default Vue.extend({
  name: "AssetsSummary",
  components: { FileUpload },
  props: {
    assets: Array,
  },
  data: () => ({
    required: [(v: string) => !!v || "Required field"],
    name: "",
    file: new FileContent(),
    fileReady: false,
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
      this.assetService.addAsset(this.gameId(), this.name, this.file.content);
    },
  },
});
</script>

<style scoped lang="scss"></style>
