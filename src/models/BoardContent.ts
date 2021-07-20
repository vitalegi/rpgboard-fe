import { LayerConfig } from "konva/types/Layer";
import { ShapeConfig } from "konva/types/Shape";

type ExtendedShapeConfig = ShapeConfig | { componentName: string };

export class Shape<E extends ExtendedShapeConfig> {
  config?: E;

  public constructor(config?: E) {
    this.config = config;
  }
}

export class Layer {
  config?: LayerConfig;
  shapes = new Array<Shape<ExtendedShapeConfig>>();

  public constructor(config?: LayerConfig) {
    this.config = config;
  }
}

export class Group<E extends ExtendedShapeConfig> extends Shape<E> {
  children = new Array<Shape<any>>();
}
