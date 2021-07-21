<template>
  <div>
    <v-treeview :items="items()">
      <template v-slot:append="{ item }">
        <VisibilityButton
          :visible="item.visible"
          @change="changeVisibility(item.id)"
        ></VisibilityButton>
      </template>
    </v-treeview>
    <v-list>
      <v-list-group
        v-for="(layer, layerIndex) in getBoard().layers"
        :key="layerIndex"
        :value="true"
        prepend-icon="mdi-account-circle"
      >
        <template v-slot:activator>
          <v-list-item-title>
            Layer {{ layerIndex }} {{ layer.config.name }}
          </v-list-item-title>
          <v-list-item-action>
            <VisibilityButton
              :visible="layer.config.visible"
              @change="changeVisibility(layer.id)"
            ></VisibilityButton>
          </v-list-item-action>
        </template>
        <v-list-item
          v-for="(shape, shapeIndex) in layer.shapes"
          :key="shapeIndex"
          link
        >
          <v-list-item-title>
            {{ shape.config.id }} -
            {{ shape.config.name }}
          </v-list-item-title>
          <v-list-item-action>
            <VisibilityButton
              :visible="shape.config.visible"
              @change="changeVisibility(shape.id)"
            ></VisibilityButton>
          </v-list-item-action>
          <v-list-item-content> </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VisibilityButton from "./VisibilityButton.vue";
import { DD5eStoreService } from "@/dd5e/store/DD5eStore";
import Container from "typedi";
import CustomShape, { BoardContainer } from "@/models/BoardContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.BoardManager");

export default Vue.extend({
  name: "BoardManager",
  components: { VisibilityButton },
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
