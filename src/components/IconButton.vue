<template>
  <v-btn small :disabled="!editable" icon @click="change()">
    <v-icon v-if="selected">mdi-check-circle</v-icon>
    <v-icon v-else>mdi-checkbox-blank-circle-outline</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.IconButton");

export default Vue.extend({
  name: "AssetsSummary",
  components: {},
  props: {
    selected: Boolean,
    editable: Boolean,
  },
  data: () => ({}),
  methods: {
    change(): void {
      this.$emit("change", !this.selected);
    },
  },
});
</script>

<style scoped lang="scss"></style>
