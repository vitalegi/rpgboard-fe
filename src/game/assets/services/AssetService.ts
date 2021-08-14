import { Inject, Service } from "typedi";
import store from "@/store";
import Asset, { AssetPayload } from "../models/Asset";
import { factory } from "@/utils/ConfigLog4j";
import BackendService from "@/services/BackendService";
const logger = factory.getLogger("Game.Assets.Services.AssetService");

@Service()
export default class AssetService {
  public static readonly TYPE_IMAGE = "IMAGE";
  //@Inject()
  backendService: BackendService;

  public constructor(backendService: BackendService) {
    this.backendService = backendService;
  }

  public async addAsset(
    gameId: string,
    name: string,
    content: string
  ): Promise<string> {
    logger.info(`Create new asset for game ${gameId}: ${name}`);
    const asset = await this.backendService.addAsset(
      gameId,
      name,
      content,
      {},
      AssetService.TYPE_IMAGE
    );
    // TODO remove payload
    const assetPayload = new AssetPayload();
    assetPayload.id = asset.assetId;
    assetPayload.content = content;
    store.commit("assets/addAsset", asset);
    store.commit("assets/addPayload", assetPayload);
    return Promise.resolve(asset.assetId);
  }

  public async getAsset(gameId: string, assetId: string): Promise<Asset> {
    const assets: Array<Asset> = store.getters["assets/assets"];
    let asset = assets.find((a) => a.assetId === assetId);
    if (asset) {
      return asset;
    }
    logger.info(`Asset ${assetId} not found in cache, retrieve from service.`);
    asset = await this.backendService.getAsset(gameId, assetId);
    store.commit("assets/addAsset", asset);
    return asset;
  }

  public async getPayload(assetId: string): Promise<AssetPayload> {
    const payload: AssetPayload = store.getters["assets/payloadById"](assetId);
    if (payload) {
      return payload;
    }
    throw new Error(`Payload ${assetId} not found`);
  }
}
