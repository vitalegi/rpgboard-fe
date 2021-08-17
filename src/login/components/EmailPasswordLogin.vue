<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            label="E-Mail"
            required
            autocomplete="email"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            @click:append="showPassword = !showPassword"
            autocomplete="current-password"
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="error !== ''">
          <div style="color: red">{{ error }}</div>
        </v-col>
        <v-col cols="12">
          <v-btn @click="login(email, password)" color="primary">
            Sign-in
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn @click="login('test1@localhost.it', 'password')">
            test1@localhost.it
          </v-btn>
          <v-btn @click="login('test2@localhost.it', 'password')">
            test2@localhost.it
          </v-btn>
          <v-btn @click="login('test3@localhost.it', 'password')">
            test3@localhost.it
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import AuthService from "@/login/services/AuthService";
import { Container } from "typedi";
import { factory } from "@/utils/ConfigLog4j";
import BackendService from "@/services/BackendService";
const logger = factory.getLogger("Login.Components.EmailPasswordLogin");

export default Vue.extend({
  name: "EmailPasswordLogin",
  components: {},
  props: {},
  data: () => ({
    email: "",
    password: "",
    showPassword: false,
    error: "",
    authService: Container.get<AuthService>(AuthService),
    backendService: Container.get<BackendService>(BackendService),
  }),
  methods: {
    async login(email: string, password: string): Promise<void> {
      try {
        this.error = "";
        await this.authService.login(email, password);
      } catch (error) {
        this.accessFailure(error);
      }
    },
    accessFailure(error: any): void {
      logger.error(error);
      this.error = this.mapErrorCode(error.code);
    },
    mapErrorCode(code: string): string {
      switch (code) {
        case "auth/email-already-in-use":
          return "E-Mail già in uso";
        case "auth/invalid-email":
          return "E-Mail non valida";
        case "auth/operation-not-allowed":
          return "Modalità di autenticazione non disponibile";
        case "auth/weak-password":
          return "Password debole";
        case "auth/wrong-password":
          return "Password non valida";
        case "auth/user-not-found":
          return "L'utente non esiste";
      }
      return "Errore generico";
    },
  },
});
</script>

<style scoped lang="scss"></style>
