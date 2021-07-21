import CustomShape, { BoardContainer } from "@/models/BoardContent";
import GamePlayer from "@/models/GamePlayer";
import ArrayUtil from "@/utils/ArrayUtil";
import { Service } from "typedi";
import Vue from "vue";
import { Module } from "vuex";

const dd5e: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      players: new Array<GamePlayer>(),
      board: new BoardContainer(),
    };
  },
  mutations: {
    replacePlayers(state: any, players: Array<GamePlayer>) {
      ArrayUtil.removeAll(state.players);
      players.forEach((player) => state.players.push(player));
    },
    setBoard(state: any, content: BoardContainer) {
      Vue.set(state, "board", content);
    },
  },
  getters: {
    players: (state: any) => state.players,
    board: (state: any) => state.board,
  },
  actions: {},
  modules: {},
};

export default dd5e;

@Service()
export class DD5eStoreService {
  public moduleName(gameId: string): string {
    return `dd5e${gameId}`;
  }
}