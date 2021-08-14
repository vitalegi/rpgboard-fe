<template>
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>

    <v-card v-if="selectAssetStep">
      <v-card-title class="text-h5 lighten-2"> Select asset </v-card-title>
      <v-card-text>
        <AssetsSummary :selectable="true" @select="selectAsset"></AssetsSummary>
      </v-card-text>
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
import { DD5eStoreService } from "@/dd5e/store/DD5eStore";
import Container from "typedi";
import BoardSummary from "./BoardSummary.vue";
import BoardContentService from "../services/BoardContentService";
import AssetsSummary from "@/game/assets/components/AssetsSummary.vue";
import AssetService from "@/game/assets/services/AssetService";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Board.Components.BoardManagerAddImage");

const SELECT_ASSET = "SELECT_ASSET";
const SELECT_TARGET = "SELECT_TARGET";

export default Vue.extend({
  name: "BoardManagerAddImage",
  components: { AssetsSummary, BoardSummary },
  data: () => ({
    dd5eService: Container.get<DD5eStoreService>(DD5eStoreService),
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
    assetService: Container.get<AssetService>(AssetService),
    dialog: false,
    step: SELECT_ASSET,
    assetId: "",
  }),
  computed: {
    selectAssetStep(): boolean {
      return this.step === SELECT_ASSET;
    },
    selectTargetStep(): boolean {
      return this.step === SELECT_TARGET;
    },
  },
  methods: {
    gameId(): string {
      return this.$store.getters["game/getGameId"];
    },
    async addNode(id: string, assetId: string): Promise<void> {
      const asset = await this.assetService.getAsset(this.gameId(), assetId);
      const payload = await this.assetService.getPayload(assetId);
      const content = await this.boardContentService.createImage(
        asset,
        payload.content
      );
      this.$store.commit(`board/addNode`, {
        siblingId: id,
        node: content,
      });
    },
    selectAsset(assetId: string): void {
      logger.info(`Select asset ${assetId}`);
      this.assetId = assetId;
      this.step = SELECT_TARGET;
    },
    async selectTarget(targetId: string): Promise<void> {
      logger.info(`Select target ${targetId}`);
      await this.addNode(targetId, this.assetId);
      this.dialog = false;
    },
  },
  watch: {
    dialog(visible) {
      if (visible) {
        logger.info(`Closed the dialog, reset status.`);
        this.step = SELECT_ASSET;
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
