<template>
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-folder-plus-outline</v-icon>
      </v-btn>
    </template>

    <v-card v-if="selectNameStep">
      <v-card-title class="text-h5 lighten-2"> Group name </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Group name"
          outlined
          clearable
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn icon :disabled="name.trim() == ''" @click="selectName()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="selectTargetStep">
      <v-card-title class="text-h5 lighten-2"> Select target </v-card-title>
      <v-card-text>
        <BoardSummary :selectable="true" @select="selectTarget"></BoardSummary>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Container from "typedi";
import BoardSummary from "./BoardSummary.vue";
import BoardContentService from "../services/BoardContentService";
import AssetService from "@/game/assets/services/AssetService";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Board.Components.BoardManagerAddGroup");

const SELECT_NAME = "SELECT_NAME";
const SELECT_TARGET = "SELECT_TARGET";

export default Vue.extend({
  name: "BoardManagerAddGroup",
  components: { BoardSummary },
  data: () => ({
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
    assetService: Container.get<AssetService>(AssetService),
    dialog: false,
    step: SELECT_NAME,
    name: "",
  }),
  computed: {
    selectNameStep(): boolean {
      return this.step === SELECT_NAME;
    },
    selectTargetStep(): boolean {
      return this.step === SELECT_TARGET;
    },
  },
  methods: {
    async addGroup(id: string, name: string): Promise<void> {
      logger.info(`TODO add group ${name} after ${id} item on backend`);
      const group = await this.boardContentService.createGroup(name);
      this.$store.commit(`board/addNode`, {
        siblingId: id,
        node: group,
      });
    },
    selectName(): void {
      logger.info(`Select name ${this.name}`);
      this.step = SELECT_TARGET;
    },
    async selectTarget(targetId: string): Promise<void> {
      logger.info(`Select target ${targetId}`);
      await this.addGroup(targetId, this.name.trim());
      this.dialog = false;
    },
  },
  watch: {
    dialog(visible) {
      if (visible) {
        logger.info(`Closed the dialog, reset status.`);
        this.step = SELECT_NAME;
      }
    },
  },
});
</script>

<style scoped lang="scss">
.v-card__text {
  max-height: 600px;
}
</style>
