import Vue from "vue";
import Vuex from "vuex";

import Game from "@/models/Game";
import ArrayUtil from "@/utils/ArrayUtil";
import { factory } from "@/utils/ConfigLog4j";
import backendService from "@/services/BackendService";
const logger = factory.getLogger("Store");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    gameId: "",
    games: new Array<Game>(),
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    selectGame(state, gameId) {
      state.gameId = gameId;
    },
    updateGames(state, games: Array<Game>) {
      logger.info("mutation - updateGames");
      ArrayUtil.removeAll(state.games);
      games.forEach((game) => state.games.push(game));
    },
  },
  getters: {
    getGameId: (state) => state.gameId,
    games: (state) => state.games,
  },
  actions: {
    updateGames: (context) => {
      logger.debug("action - updateGames");
      backendService.getGames().then((games) => {
        context.commit("updateGames", games);
        logger.info("action - updateGames - END");
      });
    },
  },
  modules: {
    auth: {
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
    },
  },
});
