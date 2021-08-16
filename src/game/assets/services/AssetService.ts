import { Service } from "typedi";
import store from "@/store";
import Asset from "../models/Asset";
import { factory } from "@/utils/ConfigLog4j";
import BackendService from "@/services/BackendService";
const logger = factory.getLogger("Game.Assets.Services.AssetService");

@Service()
export default class AssetService {
  public static readonly TYPE_IMAGE = "IMAGE";
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
    store.commit("assets/addAsset", asset);
    return asset.assetId;
  }

  public async getAsset(gameId: string, assetId: string): Promise<Asset> {
    let asset: Asset = store.getters["assets/asset"](assetId);
    if (asset) {
      return asset;
    }
    logger.info(`Asset ${assetId} not found in cache, retrieve from service.`);
    asset = await this.backendService.getAsset(gameId, assetId);
    store.commit("assets/addAsset", asset);
    return asset;
  }

  public async getPayload(gameId: string, assetId: string): Promise<string> {
    const asset = await this.getAsset(gameId, assetId);
    return asset.content;
  }
}
