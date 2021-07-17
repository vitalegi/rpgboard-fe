import GamePlayer from "@/models/GamePlayer";
import ArrayUtil from "@/utils/ArrayUtil";
import { Service } from "typedi";
import { Module } from "vuex";

const dd5e: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      players: new Array<GamePlayer>(),
    };
  },
  mutations: {
    replacePlayers(state: any, players: Array<GamePlayer>) {
      ArrayUtil.removeAll(state.players);
      players.forEach((player) => state.players.push(player));
    },
  },
  getters: {
    players: (state: any) => state.players,
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
