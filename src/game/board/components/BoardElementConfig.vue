<template>
  <v-container>
    <v-row dense no-gutters>
      <v-col cols="12" style="text-align: right">
        <IconButton
          type="eye"
          :selected="element.config.visible"
          :editable="true"
          @change="changeVisibility(element.entryId)"
        />
        <v-dialog v-model="dialogDelete" max-width="600" scrollable>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              color="error"
              style="margin-left: 5px"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Danger zone</v-card-title>
            <v-card-text
              >This action can't be undone, do you want to proceed?</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialogDelete = false"> Abort </v-btn>
              <v-btn
                text
                @click="
                  deleteNode(element.entryId);
                  dialogDelete = false;
                "
              >
                Proceed
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="order"
          label="Order"
          placeholder="1"
          @change="move(element.entryId, order)"
          :rules="[number]"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="updatePolicy"
          :items="policies"
          label="Update Policy"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="visibilityPolicy"
          :items="policies"
          label="Visibility Policy"
        ></v-select>
      </v-col>
      <v-col cols="2"> ID </v-col>
      <v-col cols="10">
        {{ element.entryId }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/IconButton.vue";
import { factory } from "@/utils/ConfigLog4j";
import Container from "typedi";
import BoardContentService from "../services/BoardContentService";
import BoardElement from "@/models/BoardElement";
import NumberUtil from "@/utils/NumberUtil";
import VisibilityPolicy from "@/models/VisibilityPolicy";
const logger = factory.getLogger("Game.Board.Components.BoardSummary");

export default Vue.extend({
  name: "BoardElementConfig",
  components: { IconButton },
  props: {
    element: { type: BoardElement },
  },
  data: () => ({
    boardContentService: Container.get<BoardContentService>(
      BoardContentService
    ),
    leftColWidth: 4,
    order: 0,
    updatePolicy: "",
    visibilityPolicy: "",
    dialogDelete: false,
  }),
  computed: {
    rightColWidth(): number {
      return 12 - this.leftColWidth;
    },
    policies(): any[] {
      return [
        { value: VisibilityPolicy.PUBLIC, text: "Public" },
        { value: VisibilityPolicy.PROTECTED, text: "Protected" },
        { value: VisibilityPolicy.PRIVATE, text: "Private" },
      ];
    },
  },
  methods: {
    async changeVisibility(entryId: string): Promise<void> {
      logger.info(`change visibility for ${entryId}`);
      await this.boardContentService.updateVisibility(entryId);
    },
    async changeDraggable(entryId: string): Promise<void> {
      await this.boardContentService.updateDraggable(entryId);
    },
    move(id: string, variation: number): void {
      logger.info(`TODO move ${id} of ${variation} item on backend`);
    },
    deleteNode(entryId: string): void {
      this.boardContentService.delete(entryId);
    },
    number(value: string): boolean | string {
      if (NumberUtil.isNumber(value)) {
        return true;
      }
      return "not-a-number";
    },
  },
  mounted() {
    this.order = this.element.entryPosition;
    this.updatePolicy = this.element.updatePolicy;
    this.visibilityPolicy = this.element.visibilityPolicy;
  },
});
</script>

<style scoped lang="scss">
.v-treeview-node__label {
  text-align: left;
}
</style>
