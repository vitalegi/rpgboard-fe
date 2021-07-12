// DI
import "reflect-metadata";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueKonva from "vue-konva";

// firebase sdk
import firebase from "firebase";

// firebase used modules
import "firebase/analytics";
import "firebase/auth";
import { cookieUtil } from "./utils/CookieUtil";

const firebaseConfig = {
  apiKey: "AIzaSyDemNC_2rgPw7wgk5fEtBIaCTxvXNkYo3g",
  authDomain: "rpg-board-30820.firebaseapp.com",
  projectId: "rpg-board-30820",
  storageBucket: "rpg-board-30820.appspot.com",
  messagingSenderId: "726966105813",
  appId: "1:726966105813:web:d4734c0dce9a60373ad45c",
  measurementId: "G-32493M8J6R",
};
// init firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

store.commit("auth/login", cookieUtil.getCookie("USERID"));
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    cookieUtil.setCookie("USERID", user.uid);
    store.commit("auth/login", user.uid);
  } else {
    cookieUtil.removeCookie("USERID");
    store.commit("auth/logout");
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
