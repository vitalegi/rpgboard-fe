<template>
  <v-expansion-panels multiple>
    <ability-overview
      v-for="ability in player.abilities"
      :key="ability.name"
      :ability="ability"
      :player="player"
      @startDrag="startDrag"
      @drop="drop"
      @dragEnd="dragEnd"
      @dragEnter="dragEnter"
    >
    </ability-overview>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import AbilityOverview from "@/dd5e/character-sheet/components/AbilityOverview.vue";
import Player from "@/dd5e/models/Player";

const logger = factory.getLogger("Components.AbilitiesOverview");

export default Vue.extend({
  name: "AbilitiesOverview",
  components: { AbilityOverview },
  props: {
    player: { type: Player },
  },
  data: () => ({
    dragItem: "",
    dropItem: "",
  }),
  computed: {},
  methods: {
    startDrag(name: string) {
      logger.info(`Dragging ${name}`);
      this.dragItem = name;
    },
    drop() {
      logger.info(`Drop ${this.dragItem} over ${this.dropItem}`);
      if (this.dragItem === "" || this.dropItem === "") {
        return;
      }
      this.$emit("moveAbility", this.dragItem, this.dropItem);
    },
    dragEnd() {
      this.dragItem = "";
      this.dropItem = "";
    },
    dragEnter(name: string) {
      logger.debug(`Dragging ${this.dragItem} over ${name}`);
      this.dropItem = name;
    },
  },
});
</script>

<style scoped lang="scss"></style>
