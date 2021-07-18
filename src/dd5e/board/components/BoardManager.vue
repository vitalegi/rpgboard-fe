<template>
  <v-list>
    <v-list-group
      v-for="(layer, layerIndex) in getLayers()"
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
            @change="changeVisibility(layer)"
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
            @change="changeVisibility(shape)"
          ></VisibilityButton>
        </v-list-item-action>
        <v-list-item-content> </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";
import VisibilityButton from "./VisibilityButton.vue";
import { DD5eStoreService } from "@/dd5e/store/DD5eStore";
import Container from "typedi";
import { Layer } from "@/models/BoardContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.BoardManager");

export default Vue.extend({
  name: "BoardManager",
  components: { VisibilityButton },
  data: () => ({
    dd5eService: Container.get<DD5eStoreService>(DD5eStoreService),
  }),
  methods: {
    getLayers(): Array<Layer> {
      return this.$store.getters[`${this.moduleName()}/layers`];
    },
    moduleName(): string {
      const gameId = this.$store.getters["game/getGameId"];
      return this.dd5eService.moduleName(gameId);
    },
    changeVisibility(layer: Layer): void {
      if (!layer.config) {
        layer.config = {};
      }
      // TODO don't update object, submit a change to the cache
      layer.config.visible = !layer.config.visible;
    },
  },
  computed: {},
});
</script>
