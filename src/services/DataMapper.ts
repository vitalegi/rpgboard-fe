import Game from "@/models/Game";
import { factory } from "@/utils/ConfigLog4j";
import { Service } from "typedi";
import User from "@/models/User";
import Board from "@/models/Board";
import BoardElement from "@/models/BoardElement";
import Asset from "@/game/assets/models/Asset";
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
  public boardElementDeserialize(entry: any): BoardElement {
    const element = new BoardElement();
    element.boardId = entry.boardId;
    element.entryId = entry.entryId;
    element.parentId = entry.parentId;
    element.entryPosition = entry.entryPosition;
    element.updatePolicy = entry.updatePolicy;
    element.visibilityPolicy = entry.visibilityPolicy;
    element.config = entry.config;
    element.userId = entry.userId;
    element.createDate = entry.createDate;
    element.lastUpdate = entry.lastUpdate;
    return element;
  }

  public assetDeserialize(entry: any): Asset {
    const asset = new Asset();
    asset.assetId = entry.assetId;
    asset.gameId = entry.gameId;
    asset.name = entry.name;
    asset.size = entry.size;
    asset.type = entry.type;
    asset.metadata = entry.metadata;
    asset.content = entry.content;
    asset.userId = entry.userId;
    asset.createDate = entry.createDate;
    asset.lastUpdate = entry.lastUpdate;
    return asset;
  }
}
