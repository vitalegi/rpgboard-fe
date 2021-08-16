import CustomShape, { BoardContainer } from "../models/BoardContent";
import BoardContentService from "../services/BoardContentService";
import Container from "typedi";
import Vue from "vue";
import { Module } from "vuex";
import BoardElement from "@/models/BoardElement";

const board: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      container: new BoardContainer(),
    };
  },
  mutations: {
    setBoard(state: any, content: BoardContainer) {
      Vue.set(state, "container", content);
    },
    addNode(state: any, entry: { siblingId: string; node: CustomShape }) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.addNode(state.container, entry.siblingId, entry.node);
    },
    deleteNode(state: any, id: string) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.deleteNode(state.container, id);
    },
    updateBoardDraggable(state: any, id: string) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.updateDraggable(state.container, id);
    },
    moveNode(state: any, entry: { id: string; variation: number }) {
      const service = Container.get<BoardContentService>(BoardContentService);
      service.moveNode(state.container, entry.id, entry.variation);
    },
  },
  getters: {
    container: (state: any) => state.container,
    board: (state: any) => state.container.board,
    boardId: (state: any) => state.container.board.boardId,
    elements: (state: any) => state.container.elements,
  },
  modules: {},
};

export default board;
