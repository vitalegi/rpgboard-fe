<template>
  <v-container>
    <v-row v-if="!loading">
      <v-col cols="6" sm="4" v-for="game in _games()" :key="game.id">
        <SelectableGamePreview
          :game="game"
          @select="joinGame"
          @delete="deleteGame"
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="6" sm="4" v-for="id in placeholders(6)" :key="id">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import BackendService from "@/services/BackendService";
import RouterUtil from "@/utils/RouterUtil";
import ArrayUtil from "@/utils/ArrayUtil";
import Game from "@/models/Game";
import SelectableGamePreview from "./SelectableGamePreview.vue";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.SelectGame");

export default Vue.extend({
  name: "SelectGame",
  components: { SelectableGamePreview },
  data: () => ({
    backendService: Container.get<BackendService>(BackendService),
    games: [],
    loading: false,
  }),
  computed: {},
  methods: {
    async joinGame(gameId: string): Promise<void> {
      await this.backendService.joinGame(gameId);
      RouterUtil.toGame(gameId);
    },
    _games(): Array<Game> {
      return this.games as Array<Game>;
    },
    placeholders(n: number): number[] {
      const arr = new Array<number>();
      for (let i = 0; i < n; i++) {
        arr.push(i);
      }
      return arr;
    },
    async deleteGame(gameId: string): Promise<void> {
      await this.backendService.deleteGame(gameId);
      await this.updateGames();
    },
    async updateGames(): Promise<void> {
      this.loading = true;
      const games = await this.backendService.getGames();
      ArrayUtil.removeAll(this.games);
      this._games().push(...games);
      this.loading = false;
    },
  },
  async created() {
    this.updateGames();
  },
});
</script>

<style scoped lang="scss"></style>
