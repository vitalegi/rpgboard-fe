import { Module } from "vuex";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Store.GameStore");

const game: Module<any, any> = {
  namespaced: true,
  state: {
    gameId: "",
  },
  mutations: {
    selectGame(state, gameId) {
      state.gameId = gameId;
    },
  },
  getters: {
    getGameId: (state) => state.gameId,
  },
  actions: {},
  modules: {},
};

export default game;
