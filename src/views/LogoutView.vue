<template>
  <v-card class="logout logout-card" min-width="600">
    <v-card-text v-if="completed"> Logout completato. </v-card-text>
    <v-card-text v-else> Logout in corso. </v-card-text>
  </v-card>
</template>

<script lang="ts">
import authService from "@/login/services/AuthService";
import Vue from "vue";

export default Vue.extend({
  name: "LogoutView",
  components: {},
  data: () => ({
    completed: false,
  }),
  methods: {
    async logout(): Promise<void> {
      await authService.logout();
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
