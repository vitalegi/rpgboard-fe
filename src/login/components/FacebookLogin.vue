<template>
  <div>
    <button class="loginBtn loginBtn--facebook" @click="facebookLogin()">
      Login with Facebook
    </button>
    <v-btn @click="retrieveInfo()">Retrieve info</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import authService from "../services/AuthService";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Login.Components.FacebookLogin");

export default Vue.extend({
  name: "FacebookLogin",
  components: {},
  props: {},
  data: () => ({}),
  methods: {
    async facebookLogin(): Promise<void> {
      try {
        const user = authService.loginFacebook();
        console.log("done", user);
      } catch (error) {
        console.error(error);
      }
    },
    retrieveInfo(): void {
      console.log("retrieve info");
      firebase
        .auth()
        .getRedirectResult()
        .then(
          (result) => {
            console.log("OK", result);
          },
          (error) => {
            console.log("KO", error);
          }
        );
    },
  },
});
</script>

<style scoped lang="scss">
//body {
//  padding: 2em;
//}

/* Shared */
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
