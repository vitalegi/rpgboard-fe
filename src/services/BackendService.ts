import Game from "@/models/Game";
import GamePlayer from "@/models/GamePlayer";
import { GameStatus, GameType } from "@/models/Types";
import { factory } from "@/utils/ConfigLog4j";
import { Service } from "typedi";
import { WebService } from "@/utils/WebService";
const logger = factory.getLogger("Service.GameService");

@Service()
export default class BackendService {
  public getGames(): Promise<Array<Game>> {
    logger.info("getGames");
    const ws = new WebService()
      .url("http://localhost:8888/api/accounts")
      .get()
      .call()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("FAIL", err);
      });
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
      }, 2000);
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
          gamePlayer.roles = ["PLAYER"];
          if (i == 5) {
            gamePlayer.roles.push("MASTER");
          }
          players.push(gamePlayer);
        }
        logger.info("getGamePlayers - complete");
        resolve(players);
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
    game.status = status;
    return game;
  }
}
