import Vue from "vue";
import Vuex from "vuex";
import auth from "@/login/store/AuthStore";
import game from "@/game/store/GameStore";
import board from "@/game/board/store/BoardStore";
import assets from "@/game/game-assets/store/AssetStore";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {},
  mutations: {},
  getters: {},
  actions: {},
  modules: {
    auth: auth,
    game: game,
    assets: assets,
    board: board,
  },
});
