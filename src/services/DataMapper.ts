import Game from "@/models/Game";
import { factory } from "@/utils/ConfigLog4j";
import { Service } from "typedi";
import User from "@/models/User";
import Board from "@/models/Board";
const logger = factory.getLogger("Service.GameService");

@Service()
export default class DataMapper {
  public userDeserialize(entry: any): User {
    const user = new User();
    user.userId = entry.userId;
    user.name = entry.name;
    return user;
  }

  public gameDeserialize(entry: any): Game {
    const game = new Game();
    game.gameId = entry.gameId;
    game.name = entry.name;
    game.status = entry.status;
    game.visibilityPolicy = entry.visibilityPolicy;
    game.type = entry.type;
    game.ownerId = entry.ownerId;
    return game;
  }

  public boardDeserialize(entry: any): Board {
    const board = new Board();
    board.gameId = entry.gameId;
    board.boardId = entry.boardId;
    board.name = entry.name;
    board.active = entry.active;
    board.visibilityPolicy = entry.visibilityPolicy;
    board.userId = entry.userId;
    board.createDate = entry.createDate;
    board.lastUpdate = entry.lastUpdate;

    return board;
  }
}
