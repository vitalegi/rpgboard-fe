import { Module } from "vuex";

const auth: Module<any, any> = {
  namespaced: true,
  state: {
    authenticated: false,
    userId: "",
  },
  mutations: {
    login(state: any, userId: string) {
      state.userId = userId;
      state.authenticated = true;
    },
    logout(state: any) {
      state.userId = "";
      state.authenticated = false;
    },
  },
  getters: {
    userId: (state: any) => state.userId,
    authenticated: (state: any) => state.authenticated,
  },
  actions: {},
  modules: {},
};

export default auth;
