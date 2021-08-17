import BoardContentService from "../services/BoardContentService";
import Container from "typedi";
import Vue from "vue";
import { Module } from "vuex";
import BoardElement from "@/models/BoardElement";

import { factory } from "@/utils/ConfigLog4j";
import Board from "@/models/Board";
const logger = factory.getLogger("Game.Board.Store.BoardStore");

const board: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      board: new Board(),
      elements: new Array<BoardElement>(),
    };
  },
  mutations: {
    setBoard(state: any, board: Board) {
      Vue.set(state, "board", board);
    },
    setElements(state: any, elements: BoardElement[]) {
      Vue.set(state, "elements", elements);
    },
    addElement(state: any, element: BoardElement) {
      logger.info(`Add locally ${JSON.stringify(element)}`);
      state.elements.push(element);
      console.log("elements", state.elements);
    },
    updateElement(state: any, element: BoardElement) {
      logger.info(`Update locally ${JSON.stringify(element)}`);
      const elements = state.elements as BoardElement[];
      const index = elements.findIndex((e) => e.entryId === element.entryId);
      if (index !== -1) {
        elements.splice(index, 1, element);
      } else {
        throw new Error(`Element ${element.entryId} not found locally`);
      }
    },
    deleteElement(state: any, entryId: string) {
      logger.info(`Update locally ${entryId}`);
      const elements = state.elements as BoardElement[];
      const index = elements.findIndex((e) => e.entryId === entryId);
      if (index !== -1) {
        elements.splice(index, 1);
      } else {
        throw new Error(`Element ${entryId} not found locally`);
      }
    },
    moveNode(state: any, entry: { id: string; variation: number }) {
      // TODO implement
    },
  },
  getters: {
    board: (state: any) => state.board,
    boardId: (state: any) => state.board.boardId,
    elements: (state: any) => state.elements,
  },
  modules: {},
};

export default board;
