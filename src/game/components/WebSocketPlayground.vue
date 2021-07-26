<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="init()">init</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="name"></v-text-field>
        <v-btn @click="add()">Add</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import EventBus from "vertx3-eventbus-client";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.SelectGame");

let eventBus: EventBus.EventBus;

export default Vue.extend({
  name: "WebSocketPlayground",

  data: () => ({ name: "" }),
  computed: {},
  methods: {
    init() {
      eventBus = new EventBus("http://localhost:8888/eventbus");
      eventBus.enableReconnect(true);

      eventBus.onopen = () => {
        console.log("onopen");
        eventBus.registerHandler(
          "external.games",
          (err: Error, message: any) => {
            console.log("getAll ", message, err);
          }
        );
      };
    },
    add() {
      eventBus.publish("external.game.add", { name: this.name });
    },
  },
});
</script>

<style scoped lang="scss"></style>
