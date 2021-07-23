import CustomShape, { BoardContainer } from "@/models/BoardContent";
import GamePlayer from "@/models/GamePlayer";
import ArrayUtil from "@/utils/ArrayUtil";
import BoardContentService from "../services/BoardContentService";
import Container, { Service } from "typedi";
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
    updateBoardVisibility(state: any, id: string) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.updateVisibility(state.board, id);
    },
    updateBoardDraggable(state: any, id: string) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.updateDraggable(state.board, id);
    },
    moveNode(state: any, entry: { id: string; variation: number }) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.moveNode(state.board, entry.id, entry.variation);
    },
    deleteNode(state: any, id: string) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.deleteNode(state.board, id);
    },
    addNode(state: any, entry: { siblingId: string; node: CustomShape }) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.addNode(state.board, entry.siblingId, entry.node);
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
