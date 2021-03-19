import { GameStatus, GameType } from "@/models/Types";
export default class Game {
  private _id = "";
  private _name = "";
  private _masterId = "";
  private _gameType: GameType = "DD5e";
  private _status: GameStatus = "ONGOING";

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get masterId(): string {
    return this._masterId;
  }
  public set masterId(value: string) {
    this._masterId = value;
  }
  public get status(): GameStatus {
    return this._status;
  }
  public set status(value: GameStatus) {
    this._status = value;
  }
  public get gameType(): GameType {
    return this._gameType;
  }
  public set gameType(value: GameType) {
    this._gameType = value;
  }
}
