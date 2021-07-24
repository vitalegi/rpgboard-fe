import Asset, { AssetPayload } from "../models/Asset";
import { Module } from "vuex";

const assets: Module<any, any> = {
  namespaced: true,
  state: () => {
    return {
      assets: new Array<Asset>(),
      payloads: new Array<AssetPayload>(),
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
    addPayload(state: any, payload: AssetPayload) {
      state.payloads.push(payload);
    },
  },
  getters: {
    assets: (state: any) => state.assets,
    payloadById(state: any) {
      return (id: string) => {
        const payloads = state.payloads as Array<AssetPayload>;
        return payloads.find((p) => p.id === id);
      };
    },
  },
  actions: {},
  modules: {},
};

export default assets;
