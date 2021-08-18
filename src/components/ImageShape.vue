<template>
  <v-image
    :config="combinedConfig"
    @dragstart="dragstart"
    @dragend="dragend"
    @dragmove="dragmove"
  ></v-image>
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
    dragstart: Function,
    dragmove: Function,
    dragend: Function,
  },
  computed: {
    gameId(): string {
      return this.$store.getters["game/getGameId"];
    },
    combinedConfig: function () {
      const config: Record<string, unknown> = ObjectUtil.shallowCopy(
        this.config
      );
      config.image = this.renderedImage;
      return config;
    },
  },
  methods: {
    assetContentSrc(gameId: string, assetId: string): string {
      return `${process.env.VUE_APP_BACKEND}/content/game/${gameId}/asset/${assetId}`;
    },
  },
  async mounted() {
    const image = new window.Image();
    image.src = this.assetContentSrc(this.gameId, this.config.assetId);
    image.onload = () => {
      this.renderedImage = image as HTMLImageElement;
    };
  },
});
</script>

<style scoped lang="scss"></style>
