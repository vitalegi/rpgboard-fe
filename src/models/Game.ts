import { GameType } from "@/models/Types";
import GameStatus from "@/models/GameStatus";

export default class Game {
  public gameId = "";
  public name = "";
  public type: GameType = "DD5e";
  public status: GameStatus = GameStatus.OPEN;
  public ownerId = "";
}
