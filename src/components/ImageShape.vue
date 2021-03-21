<template>
  <v-image :config="combinedConfig"></v-image>
</template>

<script lang="ts">
import Vue from "vue";

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
      const config = JSON.parse(JSON.stringify(this.config));
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
