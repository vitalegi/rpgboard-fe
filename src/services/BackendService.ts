import Game from "@/models/Game";
import GamePlayer from "@/models/GamePlayer";
import { GameType } from "@/models/Types";
import GameStatus from "@/models/GameStatus";
import GameRole from "@/models/GameRole";
import { factory } from "@/utils/ConfigLog4j";
import { Service } from "typedi";
import { BackendWebService } from "@/utils/WebService";
import DataMapper from "./DataMapper";
import User from "@/models/User";
import VisibilityPolicy from "@/models/VisibilityPolicy";
import Board from "@/models/Board";
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
}
