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
        <v-container>
          <v-row dense>
            <v-spacer></v-spacer>
            <v-col cols="5" class="ability-actions">
              <v-btn outlined icon small color="secondary">
                <v-icon @click="selectAbility($event, ability)">
                  mdi-share
                </v-icon>
              </v-btn>
              <v-btn outlined icon small color="primary">
                <v-icon> mdi-play </v-icon>
              </v-btn>
            </v-col>
            <v-col
              v-if="isNotNullOrEmpty(ability.range)"
              class="ability-attribute"
              cols="12"
            >
              <b>Range</b>: {{ ability.range }}
            </v-col>
            <v-col
              v-if="isNotNullOrEmpty(ability.components)"
              class="ability-attribute"
              cols="12"
            >
              <b>Components</b>: {{ ability.components }}
            </v-col>
            <v-col
              v-if="isNotNullOrEmpty(ability.castingTime)"
              class="ability-attribute"
              cols="12"
            >
              <b>Casting Time</b>: {{ ability.castingTime }}
            </v-col>
            <v-col
              v-if="isNotNullOrEmpty(ability.duration)"
              class="ability-attribute"
              cols="12"
            >
              <b>Duration</b>: {{ ability.duration }}
            </v-col>
            <v-col
              v-if="isNotNullOrEmpty(ability.attackFormula)"
              class="ability-attribute"
              cols="12"
            >
              <b>HIT</b>: {{ printableFormula(ability.attackFormula) }}
            </v-col>
            <v-col
              v-if="ability.damages !== null && ability.damages.length > 0"
              class="ability-attribute"
              cols="12"
            >
              <b>Damage</b>: {{ printableDamages(ability.damages) }}
            </v-col>
            <v-col cols="12">
              <div
                v-if="ability.description.trim() !== ''"
                v-html="processMarkdown(ability.description)"
                class="ability-description"
              ></div>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </span>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import Ability, { Damage } from "@/dd5e/models/Ability";
import Player from "@/dd5e/models/Player";
import MarkDownService from "@/services/MarkDownService";
import { Container } from "typedi";
import StatsRetrieverService from "@/dd5e/services/StatsRetrieverService";

const logger = factory.getLogger("Components.AbilityOverview");

export default Vue.extend({
  name: "AbilityOverview",
  components: {},
  props: {
    player: { type: Player },
    ability: { type: Ability },
  },
  data: () => ({
    statsRetrieverService: Container.get<StatsRetrieverService>(
      StatsRetrieverService
    ),
    markDownService: Container.get<MarkDownService>(MarkDownService),
  }),
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
      return this.markDownService.parse(text);
    },
    printableFormula(formula: string): string {
      return this.statsRetrieverService.printableFormula(formula, this.player);
    },
    printableDamages(damages: Damage[]): string {
      return damages
        .map(
          (damage) => this.printableFormula(damage.formula) + " " + damage.type
        )
        .join(" / ");
    },
    isNotNullOrEmpty(value: string): boolean {
      return typeof value === "string" && value.trim().length > 0;
    },
    selectAbility(event: any, ability: Ability): void {
      logger.info(`Select ${ability.name}`);
      event.preventDefault();
    },
  },
});
</script>

<style scoped lang="scss">
.ability-description {
  text-align: justify;
}
.ability-attribute {
  text-align: left;
}
.ability-actions {
  text-align: right;
}
.v-btn--icon {
  margin-left: 5px;
}
</style>
