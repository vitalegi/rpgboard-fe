export default class CustomShape {
  componentName = "";
  config: any = {};
  children = new Array<CustomShape>();

  public constructor(config: any) {
    this.config = config;
  }
}

export class Grid {
  visible;
  gridStep;
  offsetX;
  offsetY;

  public constructor(visible = false, gridStep = 50, offsetX = 0, offsetY = 0) {
    this.visible = visible;
    this.gridStep = gridStep;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
}

export class BoardContainer {
  layers = Array<CustomShape>();
  grid = new Grid();
}
