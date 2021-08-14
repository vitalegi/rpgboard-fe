// DI
import "reflect-metadata";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueKonva from "vue-konva";

// firebase sdk
import firebase from "firebase/app";

// firebase used modules
import "firebase/analytics";
import "firebase/auth";
import Container from "typedi";
import AuthService from "./login/services/AuthService";

const firebaseConfig = JSON.parse(process.env.VUE_APP_FIREBASE_PUBLIC_CONFIG);

// init firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().onAuthStateChanged((user) => {
  const authService = Container.get<AuthService>(AuthService);
  if (user) {
    authService.successfulLogin(user);
  } else {
    authService.logout();
  }
});

Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
