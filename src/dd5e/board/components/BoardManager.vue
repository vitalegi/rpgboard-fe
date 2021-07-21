<template>
  <v-treeview :items="items()">
    <template v-slot:append="{ item }">
      <IconButton
        type="eye"
        :selected="item.visible"
        :editable="true"
        @change="changeVisibility(item.id)"
      />
      <v-btn icon small>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-treeview>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "../../../components/IconButton.vue";
import { DD5eStoreService } from "@/dd5e/store/DD5eStore";
import Container from "typedi";
import CustomShape, { BoardContainer } from "@/models/BoardContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.BoardManager");

export default Vue.extend({
  name: "BoardManager",
  components: { IconButton },
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
      logger.info(`TODO change visibility of ${id} item`);
      // TODO don't update object, submit a change to the cache
      //layer.config.visible = !layer.config.visible;
    },
    items(): Array<any> {
      return this.getBoard().layers.map((layer) => {
        return {
          id: layer.config?.id,
          name: layer.config?.id,
          visible: layer.config?.visible,
          children: layer.children.map((shape) => this.mapShape(shape)),
        };
      });
    },
    mapShape(shape: CustomShape): Array<any> {
      const element: any = {};
      element.id = shape.config.id;
      element.name = shape.config.id;
      element.visible = shape.config.visible;
      const children = shape.children;
      if (children !== undefined && children.length > 0) {
        element.children = children.map((child) => this.mapShape(child));
      }
      return element;
    },
  },
});
</script>
