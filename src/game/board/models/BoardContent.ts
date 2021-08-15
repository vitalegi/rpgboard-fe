import Board from "@/models/Board";
import BoardElement from "@/models/BoardElement";

export class ShapeType {
  public static IMAGE = "image-shape";
  public static GROUP = "v-group";
  public static LAYOUT = "v-layout";
  public static RECTANGLE = "v-rect";
  public static CIRCLE = "v-circle";
  public static LINE = "v-line";

  public static isFolder(shape: CustomShape): boolean {
    const folders = [ShapeType.GROUP, ShapeType.LAYOUT];
    return folders.findIndex((f) => f === shape.config.componentName) !== -1;
  }
}

export default class CustomShape {
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
  board = new Board();
  elements = new Array<BoardElement>();
  layers = Array<CustomShape>();
  grid = new Grid();
}
