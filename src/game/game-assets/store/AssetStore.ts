import Asset from "../models/Asset";
import { Module } from "vuex";

const assets: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      assets: new Array<Asset>(),
    };
  },
  mutations: {
    addAsset(state: any, asset: Asset) {
      state.assets.push(asset);
    },
    removeAsset(state: any, id: string) {
      const assets = state.assets as Array<Asset>;
      const index = assets.findIndex((asset) => asset.id === id);
      assets.splice(index, 1);
    },
  },
  getters: {
    assets: (state: any) => state.assets,
  },
  actions: {},
  modules: {},
};

export default assets;
