<template>
  <v-container dense>
    <v-row>
      <v-col cols="2">
        <base-stats-overview :baseStats="player.baseStats" />
      </v-col>
      <v-col cols="2">
        <saving-throws-overview :player="player" />
      </v-col>
      <v-col cols="4">
        <skills-overview :player="player" />
      </v-col>
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
import Stats, { Stat } from "@/dd5e/models/Stats";
import skillService from "@/dd5e/services/SkillService";
import Player from "@/dd5e/models/Player";
import BaseStatsOverview from "@/dd5e/components/BaseStatsOverview.vue";
import SavingThrowsOverview from "@/dd5e/components/SavingThrowsOverview.vue";
import SkillsOverview from "@/dd5e/components/SkillsOverview.vue";
import SkillKeys from "../constants/SkillKeys";

const logger = factory.getLogger("Components.DD5eCharacterSheet");

export default Vue.extend({
  name: "DD5eCharacterSheet",
  components: { BaseStatsOverview, SavingThrowsOverview, SkillsOverview },
  props: {},
  data: () => ({
    formula: "",
    output: "",
  }),
  computed: {
    player(): Player {
      const player = new Player();
      player.name = "Sample";
      player.alignment = "BB";
      player.playerName = "Sample123";
      player.proficiencyBonus = 2;
      player.baseStats.strength = Stat.createBaseStat(2);
      player.baseStats.dexterity = Stat.createBaseStat(5);
      player.baseStats.constitution = Stat.createBaseStat(10);
      player.baseStats.intelligence = Stat.createBaseStat(13);
      player.baseStats.wisdom = Stat.createBaseStat(22);
      player.baseStats.charisma = Stat.createBaseStat(17);

      player.savingThrows.strength.proficiency = true;
      player.savingThrows.charisma.proficiency = true;

      player.skills = skillService.createSkills();
      skillService.getSkill(SkillKeys.ACROBATICS, player).proficiency = true;
      skillService.getSkill(SkillKeys.HISTORY, player).proficiency = true;
      return player;
    },
  },
  methods: {
    evaluateFormula(formula: string): void {
      statsRetrieverService
        .evaluateFormula(formula, this.player)
        .then((value) => {
          logger.info(`Output of ${formula} is ${value}`);
          this.output = `[${value}]`;
        })
        .catch((error) => (this.output = error));
    },
  },
});
</script>

<style scoped lang="scss"></style>
