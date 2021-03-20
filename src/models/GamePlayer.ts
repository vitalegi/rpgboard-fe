import { Role } from "./Types";

export default class GamePlayer {
  private _playerId = "";
  private _gameId = "";
  private _name = "";
  private _roles = new Array<Role>();

  public get playerId(): string {
    return this._playerId;
  }
  public set playerId(value: string) {
    this._playerId = value;
  }
  public get gameId(): string {
    return this._gameId;
  }
  public set gameId(value: string) {
    this._gameId = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get roles(): Array<Role> {
    return this._roles;
  }
  public set roles(value: Array<Role>) {
    this._roles = value;
  }
}
