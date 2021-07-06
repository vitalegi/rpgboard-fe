<template>
  <v-expansion-panel>
    <span
      @dragover.prevent
      @drop="drop($event)"
      @dragenter="dragEnter($event)"
      @dragend="dragEnd($event)"
    >
      <v-expansion-panel-header>
        <v-row no-gutters>
          <v-col cols="2">
            <v-icon draggable @dragstart="startDrag($event)">
              mdi-drag-vertical
            </v-icon>
          </v-col>
          <v-col cols="10" class="text--secondary">
            {{ ability.name }}
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <ul>
          <li>Range: {{ ability.range }}</li>
          <li v-if="ability.attackFormula !== ''">
            Attack: {{ printableFormula(ability.attackFormula) }}
          </li>
          <li v-if="ability.damages.length > 0">
            Damage: {{ printableDamages(ability.damages) }}
          </li>
        </ul>
        <div
          v-if="ability.description.trim() !== ''"
          v-html="processMarkdown(ability.description)"
        ></div>
      </v-expansion-panel-content>
    </span>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import Ability, { Damage } from "../models/Ability";
import Player from "../models/Player";
import marked from "marked";
import statsRetrieverService from "../services/StatsRetrieverService";

const logger = factory.getLogger("Components.AbilityOverview");

export default Vue.extend({
  name: "AbilityOverview",
  components: {},
  props: {
    player: { type: Player },
    ability: { type: Ability },
  },
  data: () => ({}),
  computed: {},
  methods: {
    startDrag(event: any) {
      this.$emit("startDrag", this.ability.name);
    },
    drop(event: any) {
      this.$emit("drop");
    },
    dragEnd(event: any) {
      this.$emit("dragEnd");
    },
    dragEnter(event: any) {
      this.$emit("dragEnter", this.ability.name);
    },
    processMarkdown(text: string): string {
      return marked(text);
    },
    printableFormula(formula: string): string {
      return statsRetrieverService.printableFormula(formula, this.player);
    },
    printableDamages(damages: Damage[]): string {
      return damages
        .map(
          (damage) => this.printableFormula(damage.formula) + " " + damage.type
        )
        .join(" / ");
    },
  },
});
</script>

<style scoped lang="scss"></style>
