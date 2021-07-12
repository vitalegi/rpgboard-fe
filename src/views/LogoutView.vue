<template>
  <v-card class="logout logout-card" min-width="600">
    <v-card-text v-if="completed"> Logout completato. </v-card-text>
    <v-card-text v-else> Logout in corso. </v-card-text>
  </v-card>
</template>

<script lang="ts">
import AuthService from "@/login/services/AuthService";
import Vue from "vue";
import { Container } from "typedi";

export default Vue.extend({
  name: "LogoutView",
  components: {},
  data: () => ({
    completed: false,
    authService: Container.get<AuthService>(AuthService),
  }),
  methods: {
    async logout(): Promise<void> {
      await this.authService.logout();
      this.completed = true;
    },
  },
  mounted() {
    this.completed = false;
    this.logout();
  },
});
</script>

<style scoped lang="scss">
.logout-card {
  margin: 0 auto;
}
</style>
