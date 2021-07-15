import { GameType } from "@/models/Types";
import GameStatus from "@/models/GameStatus";

export default class Game {
  public id = "";
  public name = "";
  public gameType: GameType = "DD5e";
  public status: GameStatus = GameStatus.OPEN;
}
