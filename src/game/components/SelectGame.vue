<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="2" v-for="game in games" :key="game.id"
        ><v-btn @click="joinGame(game.id)">{{ game.name }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import BackendService from "@/services/BackendService";
import RouterUtil from "@/utils/RouterUtil";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.SelectGame");

export default Vue.extend({
  name: "SelectGame",

  data: () => ({
    backendService: Container.get<BackendService>(BackendService),
  }),
  computed: {
    games() {
      return this.$store.getters.games;
    },
  },
  methods: {
    joinGame(gameId: string): void {
      this.backendService.joinGame(gameId).then(() => {
        logger.info(`Joined game ${gameId}`);
        RouterUtil.toGame(gameId);
      });
    },
  },
  created() {
    this.$store.dispatch("updateGames");
  },
});
</script>

<style scoped lang="scss"></style>
