<template>
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <slot name="entrypoint" v-bind:on="on" v-bind:attrs="attrs"></slot>
    </template>
    <v-card>
      <v-card-title>
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="message"></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> Abort </v-btn>
        <v-btn text @click="confirm()"> Proceed </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.ConfirmAction");

export default Vue.extend({
  name: "ConfirmAction",
  components: {},
  props: {},
  data: () => ({
    dialog: false,
  }),
  computed: {},
  methods: {
    confirm(): void {
      this.dialog = false;
      this.$emit("confirm");
    },
  },
});
</script>

<style scoped lang="scss"></style>
