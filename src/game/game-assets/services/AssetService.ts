import { Service } from "typedi";
import store from "@/store";
import { factory } from "@/utils/ConfigLog4j";
import Asset, { AssetPayload } from "../models/Asset";
const logger = factory.getLogger("Game.GameAssets.Services.AssetService");

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
    return Promise.resolve(asset.id);
  }
}
