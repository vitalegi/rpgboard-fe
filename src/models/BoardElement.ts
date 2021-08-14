import VisibilityPolicy from "./VisibilityPolicy";

export default class BoardElement {
  public boardId = "";
  public entryId = "";
  public parentId = "";
  public entryPosition = 0;
  public updatePolicy = "";
  public visibilityPolicy = VisibilityPolicy.PRIVATE;
  public config = new Object();
  public userId = "";
  public createDate = "";
  public lastUpdate = "";
}
