<template>
  <v-container dense>
    <v-row>
      <v-col cols="2"> STR: {{ baseStats.strength }} </v-col>
      <v-col cols="2"> DEX: {{ baseStats.dexterity }} </v-col>
      <v-col cols="2"> COS: {{ baseStats.constitution }} </v-col>
      <v-col cols="2"> INT: {{ baseStats.intelligence }} </v-col>
      <v-col cols="2"> WIS: {{ baseStats.wisdom }} </v-col>
      <v-col cols="2"> CHA: {{ baseStats.charisma }} </v-col>
    </v-row>
    <v-row>
      <v-text-field
        v-model="formula"
        label="Formula"
        @change="evaluateFormula(formula)"
      ></v-text-field>
      {{ formula }}: {{ output }}
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import statsRetrieverService from "@/dd5e/services/StatsRetrieverService";
const logger = factory.getLogger("Components.DD5eCharacterSheet");

export default Vue.extend({
  name: "DD5eCharacterSheet",
  components: {},
  props: {},
  data: () => ({
    formula: "",
    output: "",
    baseStats: {
      strength: 10,
      dexterity: 12,
      constitution: 14,
      intelligence: 16,
      wisdom: 18,
      charisma: 20,
    },
  }),
  computed: {},
  methods: {
    evaluateFormula(formula: string): void {
      statsRetrieverService
        .evaluateFormula(this.baseStats, formula)
        .then((value) => {
          this.output = `${value}`;
        })
        .catch((error) => (this.output = error));
    },
  },
});
</script>

<style scoped lang="scss"></style>
