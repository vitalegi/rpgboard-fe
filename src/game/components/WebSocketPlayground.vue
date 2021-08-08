<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="init()">init</v-btn>
        <v-btn @click="getGames()">api call</v-btn>
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
import { cookieUtil } from "@/utils/CookieUtil";
import { BackendWebService } from "@/utils/WebService";
const logger = factory.getLogger("Game.Components.SelectGame");

let eventBus: EventBus.EventBus;

export default Vue.extend({
  name: "WebSocketPlayground",

  data: () => ({ name: "" }),
  computed: {},
  methods: {
    async init() {
      const token = await this.getToken();
      eventBus = new EventBus(`${process.env.VUE_APP_BACKEND}/eventbus`, {
        vertxbus_reconnect_attempts_max: 5,
      });
      eventBus.enableReconnect(true);
      console.log("Token: " + token);
      eventBus.onopen = () => {
        console.log("Open");
        eventBus.registerHandler(
          "external.outgoing.game.9026c935-c382-49b1-b3ab-c7fc2694d9cd",
          { Authorization: token },
          (err: Error, message: any) => {
            console.log("getAll ", message, err);
          }
        );
      };
      eventBus.onerror = (error) => {
        console.error("WebSocket error", error);
      };
      eventBus.onclose = () => {
        console.log("Close connection");
      };
    },
    async add() {
      console.log("fire event");
      const token = await this.getToken();
      eventBus.publish(
        "external.incoming.game.add",
        {
          name: this.name,
          open: true,
        },
        { Authorization: token }
      );
    },
    async getToken(): Promise<string> {
      const token = await firebase.auth().currentUser?.getIdToken();
      return token ? token : "";
    },
    getGames(): void {
      const ws = new BackendWebService()
        .url("/games")
        .get()
        .call()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("FAIL", err);
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
