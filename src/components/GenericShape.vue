<template>
  <component
    :is="component"
    :config="config"
    @dragstart="dragstart"
    @dragmove="dragmove"
    @dragend="dragend"
  >
    <generic-shape
      v-for="(child, index) in children"
      :key="index"
      :component="child.config.componentName"
      :children="child.children"
      :config="child.config"
      :dragstart="child.dragStart"
      :dragmove="child.dragMove"
      :dragend="child.dragEnd"
    />
  </component>
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
    children: Array,
  },
  data: () => ({}),
  methods: {},
  computed: {},
  mounted(): void {
    console.log(
      `MOUNTED ${this.component}, ${JSON.stringify(
        this.config
      )}, ${JSON.stringify(this.children)}`
    );
  },
});
</script>

<style scoped lang="scss"></style>
