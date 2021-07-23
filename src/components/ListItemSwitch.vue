<template>
  <v-list-item>
    <v-list-item-action>
      <v-switch
        v-model="model"
        @change="change"
        :disabled="disabled"
      ></v-switch>
    </v-list-item-action>
    <v-list-item-title>{{ label }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.ListItemSwitch");

export default Vue.extend({
  name: "ListItemSwitch",
  components: {},
  props: {
    value: { type: Boolean },
    label: { type: String },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    model: false,
  }),
  computed: {},
  methods: {
    change(): void {
      this.$emit("change");
    },
  },
  mounted() {
    this.model = this.value;
  },
});
</script>

<style scoped lang="scss"></style>
