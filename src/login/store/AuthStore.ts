import { Module } from "vuex";
import firebase from "firebase/app";
import { factory } from "@/utils/ConfigLog4j";
import User from "@/models/User";
const logger = factory.getLogger("Login.Store.AuthStore");

const auth: Module<any, any> = {
  namespaced: true,
  state: {
    user: {},
    localUser: {},
  },
  mutations: {
    login(state: any, user: firebase.auth.UserCredential) {
      state.user = user;
    },
    localUser(state: any, user: User) {
      state.localUser = user;
    },
    logout(state: any) {
      state.user = null;
      state.localUser = null;
    },
  },
  getters: {
    userId: (state: any) => state.user.uid,
    authenticated: (state: any): boolean => state.user?.uid,
    verified: (state: any) => state.user.emailVerified,
    localUser: (state: any) => state.localUser,
  },
  actions: {},
  modules: {},
};

export default auth;
