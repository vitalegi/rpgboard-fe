import Game from "@/models/Game";
import GamePlayer from "@/models/GamePlayer";
import { GameType } from "@/models/Types";
import GameStatus from "@/models/GameStatus";
import GameRole from "@/models/GameRole";
import Asset from "@/game/assets/models/Asset";
import { factory } from "@/utils/ConfigLog4j";
import { Service } from "typedi";
import { BackendWebService } from "@/utils/WebService";
import DataMapper from "./DataMapper";
import User from "@/models/User";
import VisibilityPolicy from "@/models/VisibilityPolicy";
import Board from "@/models/Board";
import BoardElement from "@/models/BoardElement";
const logger = factory.getLogger("Service.GameService");

@Service()
export default class BackendService {
  protected dataMapper: DataMapper;

  constructor(dataMapper: DataMapper) {
    this.dataMapper = dataMapper;
  }
  public async getCurrentUser(): Promise<User> {
    const response = await BackendWebService.url("/user").get().call();
    return this.dataMapper.userDeserialize(response.data);
  }
  public async getGames(): Promise<Array<Game>> {
    const response = await BackendWebService.url("/games").get().call();

    const data = response.data as Array<any>;
    return data.map(this.dataMapper.gameDeserialize);
  }

  public async registerUser(name: string): Promise<User> {
    const response = await BackendWebService.url("/user/registration")
      .post()
      .call({ name: name });

    return this.dataMapper.userDeserialize(response.data);
  }

  public async createGame(name: string, gameType: GameType): Promise<Game> {
    const response = await BackendWebService.url("/game").post().call({
      name: name,
      type: gameType,
      status: GameStatus.OPEN,
      visibilityPolicy: VisibilityPolicy.PUBLIC,
    });
    return this.dataMapper.gameDeserialize(response.data);
  }
  public async joinGame(gameId: string): Promise<void> {
    const response = await BackendWebService.url(`/game/${gameId}/join`)
      .post()
      .call({});
    console.log("joinGame? ", response);
  }

  public async createBoard(
    gameId: string,
    name: string,
    visibilityPolicy: VisibilityPolicy,
    active: boolean
  ): Promise<Board> {
    const response = await BackendWebService.url(`/game/${gameId}/board`)
      .post()
      .call({
        name: name,
        visibilityPolicy: visibilityPolicy,
        active: active,
      });
    return this.dataMapper.boardDeserialize(response.data);
  }

  public async deleteGame(gameId: string): Promise<Game> {
    const response = await BackendWebService.url(`/game/${gameId}`)
      .delete()
      .call();
    return this.dataMapper.gameDeserialize(response.data);
  }

  public getGamePlayers(gameId: string): Promise<Array<GamePlayer>> {
    logger.info("getGamePlayers");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const players = [];
        for (let i = 0; i < 10; i++) {
          const gamePlayer = new GamePlayer();
          gamePlayer.gameId = gameId;
          gamePlayer.name = `Nome Giocatore ${i}`;
          gamePlayer.playerId = `${i}`;
          gamePlayer.roles = [GameRole.PLAYER];
          if (i == 5) {
            gamePlayer.roles.push(GameRole.MASTER);
          }
          players.push(gamePlayer);
        }
        logger.info("getGamePlayers - complete");
        resolve(players);
      }, 500);
    });
  }

  public async getActiveBoard(gameId: string): Promise<Board | null> {
    const response = await BackendWebService.url(`/game/${gameId}/activeBoard`)
      .get()
      .call();
    return this.dataMapper.boardDeserialize(response.data);
  }

  public async getBoardElements(boardId: string): Promise<Array<BoardElement>> {
    const response = await BackendWebService.url(`/board/${boardId}/elements`)
      .get()
      .call();

    const data = response.data as Array<any>;
    return data.map(this.dataMapper.boardElementDeserialize);
  }

  public async addAsset(
    gameId: string,
    name: string,
    content: string,
    metadata: any,
    type: string
  ): Promise<Asset> {
    const response = await BackendWebService.url(`/game/${gameId}/asset`)
      .post()
      .call({ name: name, content: content, metadata: metadata, type: type });
    return this.dataMapper.assetDeserialize(response.data);
  }

  public async getAssets(gameId: string): Promise<Array<Asset>> {
    const response = await BackendWebService.url(`/game/${gameId}/assets`)
      .get()
      .call({});

    const data = response.data as Array<any>;
    return data.map(this.dataMapper.assetDeserialize);
  }

  public async getAsset(gameId: string, assetId: string): Promise<Asset> {
    const response = await BackendWebService.url(
      `/game/${gameId}/asset/${assetId}`
    )
      .get()
      .call({});
    return this.dataMapper.assetDeserialize(response.data);
  }

  public async deleteAsset(gameId: string, assetId: string): Promise<Asset> {
    const response = await BackendWebService.url(
      `/game/${gameId}/asset/${assetId}`
    )
      .delete()
      .call({});
    return this.dataMapper.assetDeserialize(response.data);
  }
}
