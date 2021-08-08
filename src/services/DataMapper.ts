import Game from "@/models/Game";
import GamePlayer from "@/models/GamePlayer";
import { GameType } from "@/models/Types";
import GameStatus from "@/models/GameStatus";
import GameRole from "@/models/GameRole";
import { factory } from "@/utils/ConfigLog4j";
import { Service } from "typedi";
import User from "@/models/User";
const logger = factory.getLogger("Service.GameService");

@Service()
export default class DataMapper {
  public gameDeserialize(entry: any): Game {
    const game = new Game();
    game.gameId = entry.id;
    game.name = entry.name;
    game.status = entry.open ? GameStatus.OPEN : GameStatus.CLOSE;
    game.type = entry.type;
    game.ownerId = entry.ownerId;
    return game;
  }

  public userDeserialize(entry: any): User {
    const user = new User();
    user.id = entry.id;
    user.name = entry.name;
    return user;
  }
}
