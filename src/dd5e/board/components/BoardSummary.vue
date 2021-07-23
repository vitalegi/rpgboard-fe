<template>
  <v-treeview :items="items()" class="v-treeview-node__label">
    <template v-slot:prepend="{ item }" v-if="selectable">
      <v-btn elevation="2" icon @click="select(item.id)">
        <v-icon>mdi-plus-box</v-icon>
      </v-btn>
    </template>
    <template v-slot:append="{ item }" v-if="showActions">
      <IconButton
        type="eye"
        :selected="item.config.visible"
        :editable="true"
        @change="changeVisibility(item.id)"
      />
      <v-btn icon small @click="move(item.id, +1)">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-btn icon small @click="move(item.id, -1)">
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
      <v-btn icon small @click="deleteNode(item.id)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <BoardManagerItemOptions
        :config="item.config"
        :disabled="false"
        @changeVisibility="changeVisibility(item.id)"
        @changeDraggable="changeDraggable(item.id)"
      />
    </template>
  </v-treeview>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "../../../components/IconButton.vue";
import BoardManagerItemOptions from "./BoardManagerItemOptions.vue";
import { DD5eStoreService } from "@/dd5e/store/DD5eStore";
import Container from "typedi";
import CustomShape, { BoardContainer } from "@/models/BoardContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.BoardSummary");

type TreeEntry = {
  id: string;
  name: string;
  config: any;
  children: Array<TreeEntry>;
};

export default Vue.extend({
  name: "BoardSummary",
  components: { IconButton, BoardManagerItemOptions },
  props: {
    selectable: { type: Boolean, default: false },
    showActions: { type: Boolean, default: false },
  },
  data: () => ({
    dd5eService: Container.get<DD5eStoreService>(DD5eStoreService),
  }),
  computed: {},
  methods: {
    getBoard(): BoardContainer {
      return this.$store.getters[`${this.moduleName()}/board`];
    },
    moduleName(): string {
      const gameId = this.$store.getters["game/getGameId"];
      return this.dd5eService.moduleName(gameId);
    },
    changeVisibility(id: string): void {
      logger.info(`TODO change visibility of ${id} item on backend`);
      this.$store.commit(`${this.moduleName()}/updateBoardVisibility`, id);
    },
    changeDraggable(id: string): void {
      logger.info(`TODO change draggable of ${id} item on backend`);
      this.$store.commit(`${this.moduleName()}/updateBoardDraggable`, id);
    },
    move(id: string, variation: number): void {
      logger.info(`TODO move ${id} of ${variation} item on backend`);
      this.$store.commit(`${this.moduleName()}/moveNode`, {
        id: id,
        variation: variation,
      });
    },
    deleteNode(id: string): void {
      logger.info(`TODO delete ${id} item on backend`);
      this.$store.commit(`${this.moduleName()}/deleteNode`, id);
    },
    items(): Array<TreeEntry> {
      return this.getBoard().layers.map(this.mapShape);
    },
    mapShape(shape: CustomShape): TreeEntry {
      const element: TreeEntry = {
        id: shape.config.id,
        name: shape.config.id,
        config: shape.config,
        children: new Array<TreeEntry>(),
      };
      const children = shape.children;
      if (children !== undefined && children.length > 0) {
        element.children = children.map((child) => this.mapShape(child));
      }
      return element;
    },
    select(id: string): void {
      this.$emit("select", id);
    },
  },
});
</script>

<style scoped lang="scss">
.v-treeview-node__label {
  text-align: left;
}
</style>
