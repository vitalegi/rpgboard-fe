<template>
  <v-card class="login login-card" max-width="600">
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col> <EmailPasswordLogin /> </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12">
            <facebook-login />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import FacebookLogin from "@/login/components/FacebookLogin.vue";
import EmailPasswordLogin from "@/login/components/EmailPasswordLogin.vue";

export default Vue.extend({
  name: "LoginView",
  components: {
    FacebookLogin,
    EmailPasswordLogin,
  },
  data: () => ({ tab: "signup" }),
  methods: {
    getUserId(): string {
      return this.$store.getters["auth/userId"];
    },
  },
});
</script>

<style scoped lang="scss">
.login-card {
  margin: 0 auto;
}
.v-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
