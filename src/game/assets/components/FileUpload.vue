<template>
  <v-card @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <v-card-text>
      <v-file-input
        v-model="filelist"
        label="File input"
        @change="fileChanged"
      ></v-file-input>
      <div>Drop a file here</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import FileContent from "../models/FileContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Assets.Components.FileUpload");

export default Vue.extend({
  name: "FileUpload",
  components: {},
  data: () => ({
    filelist: {},
    over: false,
  }),
  methods: {
    fileChanged() {
      if (this.filelist !== null) {
        this.processFile((this.filelist as unknown) as File);
      } else {
        this.$emit("upload", null);
      }
    },
    dragover(event: any) {
      event.preventDefault();
      this.over = true;
    },
    dragleave(event: any) {
      this.over = false;
    },
    drop(event: any) {
      event.preventDefault();
      const files: File[] = event.dataTransfer.files;
      files.forEach((file) => {
        this.processFile(file);
      });
      this.over = false;
    },
    processFile(file: File) {
      logger.info(`Process file ${file}`);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileContent = new FileContent();
        fileContent.name = file.name;
        fileContent.size = file.size;
        fileContent.type = file.type;
        fileContent.content = reader.result as string;
        this.$emit("upload", fileContent);
      };
    },
  },
});
</script>

<style scoped lang="scss"></style>
