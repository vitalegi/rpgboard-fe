<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="email" label="E-Mail" required></v-text-field>
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
          <v-btn @click="login()" text style="margin-right: 10px">Login</v-btn>
          <v-btn @click="register()" color="primary">Sign-in</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import AuthService from "@/login/services/AuthService";
import { Container, Service } from "typedi";
import { factory } from "@/utils/ConfigLog4j";
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
  }),
  methods: {
    async register(): Promise<void> {
      try {
        this.error = "";
        const user = await this.authService.signup(this.email, this.password);
        this.accessSuccessful(user);
      } catch (error) {
        this.accessFailure(error);
      }
    },
    async login(): Promise<void> {
      try {
        this.error = "";
        const user = await this.authService.login(this.email, this.password);
        this.accessSuccessful(user);
        //console.log("retrieve token");
        //const id = await authService.getIdToken();
        //console.log("ID: ", id);
      } catch (error) {
        this.accessFailure(error);
      }
    },
    accessSuccessful(result: any): void {
      console.log("done", result);
      this.$store.commit("auth/login", this.authService.getUserId());
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

<style scoped lang="scss">
.loginBtn {
  box-sizing: border-box;
  position: relative;
  /* width: 13em;  - apply for fixed size */
  margin: 0.2em;
  padding: 0 15px 0 46px;
  border: none;
  text-align: left;
  line-height: 34px;
  white-space: nowrap;
  border-radius: 0.2em;
  font-size: 16px;
  color: #fff;
}
.loginBtn:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 34px;
  height: 100%;
}
.loginBtn:focus {
  outline: none;
}
.loginBtn:active {
  box-shadow: inset 0 0 0 32px rgba(0, 0, 0, 0.1);
}

/* Facebook */
.loginBtn--facebook {
  background-color: #4c69ba;
  background-image: linear-gradient(#4c69ba, #3b55a0);
  /*font-family: "Helvetica neue", Helvetica Neue, Helvetica, Arial, sans-serif;*/
  text-shadow: 0 -1px 0 #354c8c;
}
.loginBtn--facebook:before {
  border-right: #364e92 1px solid;
  background: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/14082/icon_facebook.png")
    6px 6px no-repeat;
}
.loginBtn--facebook:hover,
.loginBtn--facebook:focus {
  background-color: #5b7bd5;
  background-image: linear-gradient(#5b7bd5, #4864b1);
}
</style>
