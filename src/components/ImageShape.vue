<template>
  <v-image :config="combinedConfig"></v-image>
</template>

<script lang="ts">
import Vue from "vue";
import ObjectUtil from "@/utils/ObjectUtil";

type NullableImage = HTMLImageElement | null;

export default Vue.extend({
  name: "ImageShape",
  data: () => ({
    renderedImage: null as NullableImage,
  }),
  props: {
    config: Object,
  },
  computed: {
    combinedConfig: function () {
      const config: Record<string, unknown> = ObjectUtil.shallowCopy(
        this.config
      );
      config.image = this.renderedImage;
      return config;
    },
  },
  mounted() {
    const image = new window.Image();
    image.src = this.config.image;
    image.onload = () => {
      this.renderedImage = image as HTMLImageElement;
    };
  },
});
</script>

<style scoped lang="scss"></style>
