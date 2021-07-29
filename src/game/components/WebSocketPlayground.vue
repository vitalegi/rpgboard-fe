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
import firebase from "firebase/app";
import EventBus from "vertx3-eventbus-client";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.SelectGame");

let eventBus: EventBus.EventBus;

export default Vue.extend({
  name: "WebSocketPlayground",

  data: () => ({ name: "" }),
  computed: {},
  methods: {
    async init() {
      const token = await firebase.auth().currentUser?.getIdToken();
      eventBus = new EventBus(
        `${process.env.VUE_APP_WEBSOCKET_ENDPOINT}?jwt=${token}`
      );
      eventBus.enableReconnect(true);

      eventBus.onopen = () => {
        console.log("Connection is opened");
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
