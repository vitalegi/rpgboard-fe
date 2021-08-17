import { Module } from "vuex";
import firebase from "firebase/app";
import { factory } from "@/utils/ConfigLog4j";
import User from "@/models/User";
import { cookieUtil } from "@/utils/CookieUtil";
const logger = factory.getLogger("Login.Store.AuthStore");

let authState = {
  user: {},
  localUser: {},
};

const cookie = cookieUtil.getCookie("AUTH");
if (cookie) {
  authState = JSON.parse(cookie);
}

const storeState = (user: any, localUser: any) => {
  cookieUtil.setCookie(
    "AUTH",
    JSON.stringify({ user: user, localUser: localUser })
  );
};

const auth: Module<any, any> = {
  namespaced: true,
  state: authState,
  mutations: {
    login(state: any, user: firebase.auth.UserCredential) {
      state.user = user;
      storeState(state.user, state.localUser);
    },
    localUser(state: any, user: User) {
      state.localUser = user;
      storeState(state.user, state.localUser);
    },
    logout(state: any) {
      state.user = null;
      state.localUser = null;
      storeState(state.user, state.localUser);
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
