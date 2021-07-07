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
          <td class="table-first-column">
            <icon-button
              :editable="true"
              :selected="hasProficiency(skill)"
              @change="(v) => updateProficiency(skill, v)"
            />
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
import IconButton from "@/components/IconButton.vue";

const logger = factory.getLogger("Components.SkillsOverview");

export default Vue.extend({
  name: "SkillsOverview",
  components: { IconButton },
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
    updateProficiency(skill: Skill, newValue: boolean): void {
      logger.info(`Update ${skill.id} with ${newValue}`);
      this.$emit("updateSkill", skill.id, newValue);
    },
  },
});
</script>

<style scoped lang="scss">
.table-first-column {
  text-align: left;
}
</style>
