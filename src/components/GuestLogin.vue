<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="name"
          label="Guest"
          outlined
          clearable
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn depressed @click="guestLogin"> Login </v-btn>
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import User from "@/models/User";
import { Container } from "typedi";
import authService from "@/services/AuthService";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Components.GuestLogin");

export default Vue.extend({
  name: "GuestLogin",

  data: () => ({ name: "" }),
  methods: {
    guestLogin() {
      logger.info(`start guest login process with: ${this.name}`);
      authService.guestLogin(this.name);
      this.$store.commit("selectGame", "AA");
      logger.info(`store: ${this.$store.state.getGameId()}`);
    },
  },
  created() {
    logger.info(() => `created`);
  },
  beforeDestroy() {
    logger.info(`before destroy`);
  },
});
</script>

<style scoped lang="scss"></style>
