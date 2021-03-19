export default class User {
  id;
  name;

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  public toString() {
    return `id=${this.id} name=${this.name}`;
  }
}
