// DI
import "reflect-metadata";

import { cookieUtil } from "./utils/CookieUtil";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

// firebase sdk
import firebase from "firebase/app";

// firebase used modules
import "firebase/analytics";
import "firebase/auth";

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

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.commit("auth/login", user);
  } else {
    store.commit("auth/logout");
  }
});

import VueKonva from "vue-konva";
Vue.use(VueKonva);

import VueApollo from "vue-apollo";
import apolloProvider from "@/graphql/ApolloProvider";
Vue.use(VueApollo);

Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
