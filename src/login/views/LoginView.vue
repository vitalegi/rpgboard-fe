<template>
  <v-card class="login login-card" max-width="600">
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-tabs v-model="tab" fixed-tabs>
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab key="signup"> Sign-up </v-tab>
              <v-tab key="signin"> Sign-in </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <v-tabs-items v-model="tab">
              <v-tab-item key="signup">
                <EmailPasswordRegistration />
              </v-tab-item>
              <v-tab-item key="signin">
                <EmailPasswordLogin />
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import EmailPasswordLogin from "@/login/components/EmailPasswordLogin.vue";
import EmailPasswordRegistration from "@/login/components/EmailPasswordRegistration.vue";

export default Vue.extend({
  name: "LoginView",
  components: {
    EmailPasswordLogin,
    EmailPasswordRegistration,
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
