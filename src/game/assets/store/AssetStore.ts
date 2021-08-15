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
    addAssets(state: any, assets: Array<Asset>) {
      state.assets.push(...assets);
    },
    reset(state: any, assets: Array<Asset>) {
      state.assets.splice(0);
      state.assets.push(...assets);
    },
    removeAsset(state: any, id: string) {
      const assets = state.assets as Array<Asset>;
      const index = assets.findIndex((asset) => asset.assetId === id);
      assets.splice(index, 1);
    },
  },
  getters: {
    assets: (state: any) => state.assets,
    asset(state: any) {
      return (id: string) => {
        const assets = state.assets as Array<Asset>;
        return assets.find((a) => a.assetId === id);
      };
    },
  },
  actions: {},
  modules: {},
};

export default assets;
