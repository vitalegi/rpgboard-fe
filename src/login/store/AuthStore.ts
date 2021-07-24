import { Module } from "vuex";
import firebase from "firebase/app";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Login.Store.AuthStore");

const auth: Module<any, any> = {
  namespaced: true,
  state: {
    user: {},
  },
  mutations: {
    login(state: any, user: firebase.auth.UserCredential) {
      state.user = user;
    },
    logout(state: any) {
      state.user = null;
    },
  },
  getters: {
    userId: (state: any) => state.user.uid,
    authenticated: (state: any): boolean => state.user?.uid,
    verified: (state: any) => state.user.emailVerified,
  },
  actions: {},
  modules: {},
};

export default auth;
