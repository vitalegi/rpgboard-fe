<template>
  <v-checkbox
    :input-value="visible"
    on-icon="mdi-eye-outline"
    off-icon="mdi-eye-off-outline"
    @click="changeVisibility($event)"
  ></v-checkbox>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("DD5e.Board.Components.VisibilityButton");

export default Vue.extend({
  name: "VisibilityButton",
  components: {},
  props: { visible: Boolean },
  data: () => ({}),
  methods: {
    changeVisibility(event: Event): void {
      event.stopPropagation();
      this.$emit("change");
    },
  },
  computed: {},
});
</script>
