import CustomShape, { BoardContainer } from "../models/BoardContent";
import BoardContentService from "../services/BoardContentService";
import Container from "typedi";
import Vue from "vue";
import { Module } from "vuex";

const board: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      board: new BoardContainer(),
    };
  },
  mutations: {
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
    board: (state: any) => state.board,
  },
  actions: {},
  modules: {},
};

export default board;
