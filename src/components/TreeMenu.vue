<template>
  <v-container>
    <v-row dense no-gutters>
      <v-col cols="12" v-for="element in elements" :key="element.id">
        <tree-menu-entry :element="element" :depth="1">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TreeMenuEntry from "./TreeMenuEntry.vue";

export default Vue.extend({
  name: "TreeMenu",
  components: { TreeMenuEntry },
  props: {
    elements: Array,
  },
  data: () => ({}),
  computed: {},
});
</script>

<style scoped lang="scss"></style>
