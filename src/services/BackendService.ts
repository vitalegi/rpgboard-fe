import Game from "@/models/Game";
import { GameStatus, GameType } from "@/models/Types";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Service.GameService");

class BackendService {
  public getGames(): Promise<Array<Game>> {
    logger.info("getGames");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const games = [];
        for (let i = 0; i < 10; i++) {
          games.push(
            this._createGame(`${i}`, `Game ${i}`, `Master ${i}`, "ONGOING")
          );
        }
        logger.info("getGames - complete");
        resolve(games);
      }, 500);
    });
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

  public createGame(name: string, gameType: GameType): Promise<Game> {
    logger.info("createGame");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        logger.info("createGame - complete");
        resolve(this._createGame("123", name, "567", "ONGOING"));
      }, 500);
    });
  }

  private _createGame(
    id: string,
    name: string,
    masterId: string,
    status: GameStatus
  ) {
    const game = new Game();
    game.id = id;
    game.name = name;
    game.masterId = masterId;
    game.status = status;
    return game;
  }
}
const backendService = new BackendService();
export default backendService;
