<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th colspan="2">Saving Throws</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in getStatsID()" :key="stat">
          <td class="table-first-column">
            <icon-button
              :editable="true"
              :selected="hasProficiency(stat)"
              @change="(v) => updateProficiency(stat, v)"
              type="check"
            />
            {{ stat }}
          </td>
          <td>{{ getSavingThrow(stat) }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import { Container } from "typedi";
import StatsRetrieverService from "@/dd5e/services/StatsRetrieverService";
import Player from "@/dd5e/models/Player";
import IconButton from "@/components/IconButton.vue";

const logger = factory.getLogger("Components.SavingThrowsOverview");

export default Vue.extend({
  name: "SavingThrowsOverview",
  components: { IconButton },
  props: {
    player: {
      type: Player,
    },
  },
  data: () => ({
    statsRetrieverService: Container.get<StatsRetrieverService>(
      StatsRetrieverService
    ),
  }),
  methods: {
    getSavingThrow(stat: string): number {
      const savingThrow = this.statsRetrieverService.getStat(
        this.player.savingThrows,
        stat
      );
      return this.statsRetrieverService.evaluateStatModifier(
        savingThrow,
        this.player
      );
    },
    hasProficiency(stat: string): boolean {
      const savingThrow = this.statsRetrieverService.getStat(
        this.player.savingThrows,
        stat
      );
      return savingThrow.proficiency;
    },
    getStatsID(): string[] {
      return this.statsRetrieverService.getStatKeys();
    },
    updateProficiency(stat: string, proficiency: boolean): void {
      logger.debug(`Update ${stat} with ${proficiency}`);
      this.$emit("update", stat, proficiency);
    },
  },
});
</script>

<style scoped lang="scss">
.table-first-column {
  text-align: left;
}
</style>
