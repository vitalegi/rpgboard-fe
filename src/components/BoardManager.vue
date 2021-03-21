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
        <v-list-item-content> </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";
import { Shape, Layer } from "@/models/BoardContent";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.BoardManager");

export default Vue.extend({
  name: "BoardManager",
  components: {},
  props: { layers: Array },
  data: () => ({}),
  methods: {
    getLayers(): Array<Layer> {
      return this.layers as Array<Layer>;
    },
  },
  computed: {},
});
</script>
