<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="name"
            label="Title"
            outlined
            clearable
            :rules="required"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="gameType"
            :items="gameTypes"
            label="Type"
            outlined
            :rules="required"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn depressed @click="createGame" :disabled="!valid">
            Create New
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Container } from "typedi";
import GameTypeService from "@/game/services/GameTypeService";
import BackendService from "@/services/BackendService";
import RouterUtil from "@/utils/RouterUtil";
import { factory } from "@/utils/ConfigLog4j";
import VisibilityPolicy from "@/models/VisibilityPolicy";
const logger = factory.getLogger("Game.Components.SelectGame");

export default Vue.extend({
  name: "SelectGame",

  data: () => ({
    name: "",
    gameType: "",
    valid: false,
    required: [(v: string) => !!v || "Required field"],
    backendService: Container.get<BackendService>(BackendService),
    gameTypeService: Container.get<GameTypeService>(GameTypeService),
  }),
  computed: {
    gameTypes() {
      return this.gameTypeService.getLabels();
    },
  },
  methods: {
    async createGame() {
      logger.info(`Create game ${this.name} ${this.gameType}`);
      const gameType = this.gameTypeService.mapLabelToType(this.gameType);
      const game = await this.backendService.createGame(this.name, gameType);
      logger.info(`Created game ${game.gameId}, joining.`);
      const board = await this.backendService.createBoard(
        game.gameId,
        "name",
        VisibilityPolicy.PUBLIC,
        true
      );
      logger.info(`Created board ${board.boardId}.`);
      await this.backendService.joinGame(game.gameId);
      logger.info(`Joined game ${game.gameId}.`);
      RouterUtil.toGame(game.gameId);
    },
  },
});
</script>

<style scoped lang="scss"></style>
