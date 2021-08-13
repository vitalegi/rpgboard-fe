import VisibilityPolicy from "./VisibilityPolicy";

export default class Board {
  public gameId = "";
  public boardId = "";
  public name = "";
  public active = false;
  public visibilityPolicy = VisibilityPolicy.PRIVATE;
  public userId = "";
  public createDate = "";
  public lastUpdate = "";
}
