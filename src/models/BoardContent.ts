import { LayerConfig } from "konva/types/Layer";
import { ShapeConfig } from "konva/types/Shape";

type ExtendedShapeConfig = ShapeConfig | { componentName: string };

const a: ExtendedShapeConfig = {
  componentName: "",
  id: "",
};

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
