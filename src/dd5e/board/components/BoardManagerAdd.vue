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
import AssetsSummary from "@/game/game-assets/components/AssetsSummary.vue";
import { factory } from "@/utils/ConfigLog4j";
import BoardContentService from "@/dd5e/services/BoardContentService";
import AssetService from "@/game/game-assets/services/AssetService";
const logger = factory.getLogger("Components.BoardManagerAdd");

const SELECT_ASSET = "SELECT_ASSET";
const SELECT_TARGET = "SELECT_TARGET";

export default Vue.extend({
  name: "BoardManagerAdd",
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
    moduleName(): string {
      const gameId = this.$store.getters["game/getGameId"];
      return this.dd5eService.moduleName(gameId);
    },
    async addNode(id: string, assetId: string): Promise<void> {
      logger.info(`TODO add asset ${assetId} after ${id} item on backend`);
      const asset = this.assetService.getAsset(assetId);
      const payload = await this.assetService.getPayload(assetId);
      const content = await this.boardContentService.createImage(
        asset,
        payload.content
      );
      this.$store.commit(`${this.moduleName()}/addNode`, {
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
      logger.info(`Select target ${targetId}x`);
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
