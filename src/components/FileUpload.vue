<template>
  <div
    :class="over ? 'file-over' : 'no-file-over'"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <v-file-input
      v-model="filelist"
      label="File input"
      @change="fileChanged"
    ></v-file-input>
    <div>Drop a file here</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FileContent from "@/models/FileContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.FileUpload");

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

<style scoped lang="scss">
.file-over {
  background-color: #c8e6c9;
}
.no-file-over {
  background-color: #e0e0e0;
}
</style>
