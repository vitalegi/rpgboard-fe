<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th colspan="2">Skills</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="skill in skills" :key="skill.id">
          <td class="tableLabel">
            <v-icon v-if="hasProficiency(skill)">mdi-check-circle</v-icon>
            <v-icon v-else>mdi-checkbox-blank-circle-outline</v-icon>
            {{ skill.id }} (
            <b>{{ getUsedStat(skill) }}</b>
            )
          </td>

          <td>
            <b>{{ getSkill(skill) }}</b>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import statsRetrieverService from "@/dd5e/services/StatsRetrieverService";
import Player from "@/dd5e/models/Player";
import { Skill } from "../models/Skills";
import skillService from "../services/SkillService";

const logger = factory.getLogger("Components.SavingThrowsOverview");

export default Vue.extend({
  name: "SkillsOverview",
  components: {},
  props: {
    player: {
      type: Player,
    },
  },
  data: () => ({}),
  computed: {
    skills(): Array<Skill> {
      return this.player.skills;
    },
  },
  methods: {
    getUsedStat(skill: Skill): string {
      return skillService.getUsedStat(skill.id);
    },
    getSkill(skill: Skill): number {
      return statsRetrieverService.evaluateStatModifier(skill, this.player);
    },
    hasProficiency(skill: Skill): boolean {
      return skill.proficiency;
    },
    getStatsID(): string[] {
      return statsRetrieverService.getStatKeys();
    },
  },
});
</script>

<style scoped lang="scss">
.tableLabel {
  text-align: left;
}
</style>
