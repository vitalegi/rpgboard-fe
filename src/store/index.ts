import Vue from "vue";
import Vuex from "vuex";
import auth from "@/login/store/AuthStore";
import game from "@/game/store/GameStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  getters: {},
  actions: {},
  modules: {
    auth: auth,
    game: game,
  },
});
