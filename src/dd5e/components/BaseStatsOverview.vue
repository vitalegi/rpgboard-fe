<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th colspan="3">Base</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in getStatsID()" :key="stat">
          <td>{{ stat }}</td>
          <td>
            {{ getBaseStat(stat) }} (
            <b>{{ getModifier(getBaseStat(stat)) }}</b> )
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
import Stats from "../models/Stats";

const logger = factory.getLogger("Components.BaseStatsOverview");

export default Vue.extend({
  name: "BaseStatsOverview",
  components: {},
  props: {
    baseStats: {
      type: Stats,
    },
  },
  data: () => ({}),
  methods: {
    getModifier(value: number): number {
      return statsRetrieverService.getModifier(value);
    },
    getBaseStat(stat: string): number {
      return statsRetrieverService.getStat(this.baseStats, stat).value;
    },
    getStatsID(): string[] {
      return statsRetrieverService.getStatKeys();
    },
  },
});
</script>

<style scoped lang="scss"></style>
