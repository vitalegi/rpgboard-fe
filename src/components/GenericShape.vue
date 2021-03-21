<template>
  <component
    :is="component"
    :config="config"
    @dragstart="dragstart"
    @dragmove="dragmove"
    @dragend="dragend"
  />
</template>

<script lang="ts">
import Vue from "vue";
import ImageShape from "@/components/ImageShape.vue";

export default Vue.extend({
  name: "GenericShape",
  components: { ImageShape },
  props: {
    component: String,
    config: Object,
    dragstart: Function,
    dragmove: Function,
    dragend: Function,
  },
  data: () => ({}),
  methods: {},
});
</script>

<style scoped lang="scss"></style>
