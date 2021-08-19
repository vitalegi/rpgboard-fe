<template>
  <tree-menu :elements="items()">
    <template v-slot:title="slotProps">
      {{ slotProps.element.node.config.name }}
    </template>
    <template v-slot:body="slotProps">
      <BoardElementConfig :element="slotProps.element.node" />
    </template>
    <template v-slot:append="slotProps" v-if="selectable">
      <v-btn icon @click="select(slotProps.element.node.entryId)">
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </template>
  </tree-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import Container from "typedi";
import TreeMenu from "@/components/TreeMenu.vue";
import BoardContentService from "../services/BoardContentService";
import BoardElementConfig from "./BoardElementConfig.vue";
import BoardElement from "@/models/BoardElement";
const logger = factory.getLogger("Game.Board.Components.BoardSummary");

export default Vue.extend({
  name: "BoardSummary",
  components: {
    TreeMenu,
    BoardElementConfig,
  },
  props: {
    selectable: { type: Boolean, default: false },
  },
  data: () => ({
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
  }),
  computed: {},
  methods: {
    select(id: string): void {
      this.$emit("select", id);
    },
    items(): Array<Record<string, unknown>> {
      const elements = this.$store.getters["board/elements"] as BoardElement[];
      return this.boardContentService.createHierarchy(elements, (e) => {
        return {
          id: e.entryId,
          node: e,
          children: new Array<any>(),
        };
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
