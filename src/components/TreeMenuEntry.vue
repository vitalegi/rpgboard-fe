<template>
  <div>
    <v-row dense no-gutters>
      <!-- recreate hierarchy, if depth is too high, block it to prevent failure in the template -->
      <v-col v-if="depth > 1" :cols="Math.min(depth - 1, 7)"> </v-col>
      <!-- left button to show children -->
      <v-col cols="1">
        <v-btn icon small v-if="element.children.length > 0">
          <v-icon v-if="showChildren" @click="showChildren = false"
            >mdi-menu-down</v-icon
          >
          <v-icon v-else @click="showChildren = true">mdi-menu-right</v-icon>
        </v-btn>
      </v-col>
      <!-- title of this entry -->
      <v-col class="label">
        <slot name="title" v-bind:element="element"></slot>
      </v-col>
      <!-- additional content on the right -->
      <v-spacer></v-spacer>
      <v-col cols="1" align style="text-align: right">
        <slot name="append" v-bind:element="element">
          <v-btn icon small>
            <v-icon @click="showBody = !showBody">mdi-cog-outline</v-icon>
          </v-btn>
        </slot>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-row
        dense
        no-gutters
        :style="bodyStyle"
        v-if="showBody"
        class="transition-fast-in-fast-out v-card--reveal"
      >
        <v-col cols="12">
          <slot name="body" v-bind:element="element"></slot>
        </v-col>
      </v-row>
    </v-expand-transition>
    <v-expand-transition v-if="showChildren">
      <div class="transition-fast-in-fast-out v-card--reveal">
        <tree-menu-entry
          v-for="child in element.children"
          :key="child.id"
          :element="child"
          :depth="depth + 1"
        >
          <template v-slot:title="slotProps">
            <slot name="title" v-bind:element="slotProps.element"></slot>
          </template>
          <template v-slot:body="slotProps">
            <slot name="body" v-bind:element="slotProps.element"></slot>
          </template>
          <template v-slot:append="slotProps">
            <slot name="append" v-bind:element="slotProps.element"></slot>
          </template>
        </tree-menu-entry>
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TreeMenuEntry",
  components: {},
  props: {
    element: Object,
    depth: Number,
  },
  data: () => ({
    showChildren: false,
    showBody: false,
  }),
  computed: {
    entryStyle(): string {
      return `margin-left:${(this.depth - 1) * 20}px`;
    },
    bodyStyle(): string {
      return `margin-left:${(this.depth - 1) * 20}px`;
    },
  },
});
</script>

<style scoped lang="scss">
.label {
  text-align: left;
}
</style>
