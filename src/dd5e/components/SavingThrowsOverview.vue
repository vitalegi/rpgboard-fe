<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th colspan="3">Saving Throws</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in getStatsID()" :key="stat">
          <td>{{ stat }}</td>
          <td>{{ getSavingThrow(stat) }}</td>
          <td>{{ hasProficiency(stat) }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import statsRetrieverService from "@/dd5e/services/StatsRetrieverService";
import Stats from "@/dd5e/models/Stats";
import Player from "@/dd5e/models/Player";

const logger = factory.getLogger("Components.SavingThrowsOverview");

export default Vue.extend({
  name: "SavingThrowsOverview",
  components: {},
  props: {
    player: {
      type: Player,
    },
  },
  data: () => ({}),
  methods: {
    getSavingThrow(stat: string): number {
      const savingThrow = statsRetrieverService.getStat(
        this.player.savingThrows,
        stat
      );
      return statsRetrieverService.evaluateStatModifier(
        savingThrow,
        this.player
      );
    },
    hasProficiency(stat: string): boolean {
      const savingThrow = statsRetrieverService.getStat(
        this.player.savingThrows,
        stat
      );
      return savingThrow.proficiency;
    },
    getStatsID(): string[] {
      return statsRetrieverService.getStatKeys();
    },
  },
});
</script>

<style scoped lang="scss"></style>
