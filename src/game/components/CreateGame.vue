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
import gameTypeService from "@/services/GameTypeService";
import backendService from "@/services/BackendService";
import RouterUtil from "@/utils/RouterUtil";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.SelectGame");

export default Vue.extend({
  name: "SelectGame",

  data: () => ({
    name: "",
    gameType: "",
    valid: false,
    required: [(v: string) => !!v || "Required field"],
  }),
  computed: {
    gameTypes() {
      return gameTypeService.getLabels();
    },
  },
  methods: {
    createGame() {
      logger.info(`Create game ${this.name} ${this.gameType}`);
      const gameType = gameTypeService.mapLabelToType(this.gameType);
      backendService.createGame(this.name, gameType).then((game) => {
        logger.info(`Created game ${game.id}, joining.`);
        RouterUtil.toGame(game.id);
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
