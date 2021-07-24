<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-bind="attrs" v-on="on">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <ListItemSwitch
          :disabled="disabled"
          label="Visible"
          :value="config.visible"
          @change="changeVisibility()"
        />
        <ListItemSwitch
          :disabled="disabled"
          label="Draggable"
          :value="config.draggable"
          @change="changeDraggable()"
        />
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="menu = false"> Cancel </v-btn>
        <v-btn color="primary" text @click="menu = false"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import ListItemSwitch from "@/components/ListItemSwitch.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger(
  "Game.Board.Components.BoardManagerItemOptions"
);

export default Vue.extend({
  name: "BoardManagerItemOptions",
  components: { ListItemSwitch },
  props: {
    config: { type: Object },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
  }),
  computed: {},
  methods: {
    changeVisibility(): void {
      this.$emit("changeVisibility");
    },
    changeDraggable(): void {
      this.$emit("changeDraggable");
    },
  },
});
</script>

<style scoped lang="scss"></style>
