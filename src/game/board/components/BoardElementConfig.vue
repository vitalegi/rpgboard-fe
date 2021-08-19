<template>
  <v-card outlined>
    <v-card-title>{{ element.config.name }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-row dense no-gutters>
          <v-col cols="12" style="text-align: right">
            <IconButton
              type="eye"
              :selected="element.config.visible"
              :editable="true"
              @change="changeVisibility(element.entryId)"
            />
            <ConfirmAction @confirm="deleteNode(element.entryId)">
              <template v-slot:entrypoint="{ on, attrs }">
                <v-btn icon small color="error" v-bind="attrs" v-on="on">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <template v-slot:title> Danger zone </template>
              <template v-slot:message>
                L'azione non è reversibile, vuoi procedere?
              </template>
            </ConfirmAction>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="order"
              label="Order"
              placeholder="1"
              @change="updateEntryPosition(element.entryId, order)"
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
          <v-col cols="6">
            <v-text-field
              v-model="x"
              label="X (px)"
              placeholder="800"
              :rules="[number]"
              @change="move(element.entryId, x, y)"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="y"
              label="Y (px)"
              placeholder="800"
              @change="move(element.entryId, x, y)"
              :rules="[number]"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            Ratio<br />
            {{ ratio(width, height) }}
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="width"
              label="Width (px)"
              placeholder="800"
              @change="resize(element.entryId, width, height)"
              :rules="[number]"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="height"
              label="Height (px)"
              placeholder="600"
              @change="resize(element.entryId, width, height)"
              :rules="[number]"
            ></v-text-field>
          </v-col>
          <v-col cols="2"> ID </v-col>
          <v-col cols="10">
            {{ element.entryId }}
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
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
import ConfirmAction from "@/components/ConfirmAction.vue";
const logger = factory.getLogger("Game.Board.Components.BoardSummary");

export default Vue.extend({
  name: "BoardElementConfig",
  components: { IconButton, ConfirmAction },
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
    x: 0,
    y: 0,
    width: 0,
    height: 0,
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
    async updateEntryPosition(
      entryId: string,
      newPosition: string
    ): Promise<void> {
      if (NumberUtil.isNumber(newPosition)) {
        await this.boardContentService.updatePosition(
          entryId,
          NumberUtil.parse(newPosition)
        );
      }
    },
    async resize(
      entryId: string,
      width: string,
      height: string
    ): Promise<void> {
      if (!NumberUtil.isNumber(width) || !NumberUtil.isNumber(height)) {
        return;
      }
      this.boardContentService.updateSize(
        entryId,
        NumberUtil.parse(width),
        NumberUtil.parse(height)
      );
    },
    async move(entryId: string, x: string, y: string): Promise<void> {
      if (!NumberUtil.isNumber(x) || !NumberUtil.isNumber(y)) {
        return;
      }
      this.boardContentService.updateCoordinates(
        entryId,
        NumberUtil.parse(x),
        NumberUtil.parse(y)
      );
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
    ratio(x: number, y: number): number {
      return Math.round((x / y + Number.EPSILON) * 100) / 100;
    },
  },
  mounted() {
    this.order = this.element.entryPosition;
    this.updatePolicy = this.element.updatePolicy;
    this.visibilityPolicy = this.element.visibilityPolicy;
    this.x = this.element.config.x;
    this.y = this.element.config.y;
    this.width = this.element.config.width;
    this.height = this.element.config.height;
  },
});
</script>

<style scoped lang="scss">
.v-treeview-node__label {
  text-align: left;
}
</style>
