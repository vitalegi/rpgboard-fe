import { Module } from "vuex";

const dd5characterSheet: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      counter: 0,
    };
  },
  mutations: {
    increment(state: any) {
      state.counter++;
    },
  },
  getters: {
    count: (state: any) => state.counter,
  },
  actions: {},
  modules: {},
};

export default dd5characterSheet;
