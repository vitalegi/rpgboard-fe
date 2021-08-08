<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="email" label="E-Mail" required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="name" label="Username" required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="error !== ''">
          <div style="color: red">{{ error }}</div>
        </v-col>
        <v-col cols="12">
          <v-btn @click="register(email, name, password)" color="primary">
            Sign-up
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
const logger = factory.getLogger("Login.Components.EmailPasswordRegistration");

export default Vue.extend({
  name: "EmailPasswordRegistration",
  components: {},
  props: {},
  data: () => ({
    email: "",
    password: "",
    name: "",
    showPassword: false,
    error: "",
    authService: Container.get<AuthService>(AuthService),
    backendService: Container.get<BackendService>(BackendService),
  }),
  methods: {
    async register(
      email: string,
      name: string,
      password: string
    ): Promise<void> {
      try {
        this.error = "";
        await this.authService.signup(email, password);
        await this.backendService.registerUser(name);
      } catch (error) {
        this.accessFailure(error);
      }
    },
    accessFailure(error: any): void {
      console.error(error);
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
