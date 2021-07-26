<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="init()">init</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import EventBus from "vertx3-eventbus-client";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.SelectGame");

export default Vue.extend({
  name: "WebSocketPlayground",

  data: () => ({}),
  computed: {},
  methods: {
    init() {
      const eventBus = new EventBus("http://localhost:8888/eventbus");
      eventBus.enableReconnect(true);

      eventBus.onopen = () => {
        console.log("onopen");
        eventBus.registerHandler(
          "websocket.names",
          (err: any, message: any) => {
            console.log("received ", message);
            console.error("error", err);
          }
        );

        console.log("Sending msg");
        eventBus.publish("websocket.add-name", { name: "AAAA", id: 111 });
        console.log("msg sent");
      };
    },
  },
});
</script>

<style scoped lang="scss"></style>
