export default class User {
  userId;
  name;

  public constructor(userId = "", name = "") {
    this.userId = userId;
    this.name = name;
  }

  public toString() {
    return `userId=${this.userId} name=${this.name}`;
  }
}
