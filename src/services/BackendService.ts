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
const logger = factory.getLogger("Service.GameService");

@Service()
export default class BackendService {
  protected dataMapper: DataMapper;

  constructor(dataMapper: DataMapper) {
    this.dataMapper = dataMapper;
  }

  public async getGames(): Promise<Array<Game>> {
    const response = await new BackendWebService().url("/games").get().call();

    const data = response.data as Array<any>;
    return data.map(this.dataMapper.gameDeserialize);
  }

  public async registerUser(name: string): Promise<User> {
    const response = await new BackendWebService()
      .url("/user/registration")
      .post()
      .call({ name: name });

    return this.dataMapper.userDeserialize(response.data);
  }

  public joinGame(gameId: string): Promise<void> {
    logger.info("joinGame");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        logger.info("joinGame - complete");
        resolve();
      }, 500);
    });
  }

  public async createGame(name: string, gameType: GameType): Promise<Game> {
    const response = await new BackendWebService().url("/game").post().call({
      name: name,
      open: true,
    });
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
