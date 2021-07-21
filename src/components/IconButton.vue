<template>
  <v-btn small :disabled="!editable" icon @click="change()">
    <v-icon v-if="selected">{{ iconOn }}</v-icon>
    <v-icon v-else>{{ iconOff }}</v-icon>
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
    type: { type: String, default: "check" },
  },
  data: () => ({
    iconOn: "",
    iconOff: "",
  }),
  methods: {
    change(): void {
      this.$emit("change", !this.selected);
    },
  },
  mounted(): void {
    if (this.type === "check") {
      this.iconOn = "mdi-check-circle";
      this.iconOff = "mdi-checkbox-blank-circle-outline";
      return;
    }
    if (this.type === "eye") {
      this.iconOn = "mdi-eye-outline";
      this.iconOff = "mdi-eye-off-outline";
      return;
    }
    throw new Error(`Type ${this.type} is not valid.`);
  },
});
</script>

<style scoped lang="scss"></style>
