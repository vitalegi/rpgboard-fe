import { Service } from "typedi";
import store from "@/store";
import Asset, { AssetPayload } from "../models/Asset";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Assets.Services.AssetService");

@Service()
export default class AssetService {
  public async addAsset(
    gameId: string,
    name: string,
    content: string
  ): Promise<string> {
    logger.info(`Create new asset for game ${gameId}: ${name}`);
    const asset = new Asset();
    // TODO implement backend service
    asset.id = Math.round(Math.random() * 10000000) + "";
    asset.name = name;
    asset.type = "IMAGE";
    const assetPayload = new AssetPayload();
    assetPayload.id = asset.id;
    assetPayload.content = content;
    store.commit("assets/addAsset", asset);
    store.commit("assets/addPayload", assetPayload);
    return Promise.resolve(asset.id);
  }

  public getAsset(assetId: string): Asset {
    const assets: Array<Asset> = store.getters["assets/assets"];
    const asset = assets.find((a) => a.id === assetId);
    if (asset) {
      return asset;
    }
    throw new Error(`Asset ${assetId} not found`);
  }

  public async getPayload(assetId: string): Promise<AssetPayload> {
    const payload: AssetPayload = store.getters["assets/payloadById"](assetId);
    if (payload) {
      return payload;
    }
    throw new Error(`Payload ${assetId} not found`);
  }
}
