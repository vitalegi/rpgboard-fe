import { Service } from "typedi";
import { Shape, Layer } from "@/models/BoardContent";
import random from "@/utils/RandomUtil";
import { Vector2d } from "konva/types/types";

@Service()
export default class BoardContentService {
  public createBoardContent(): Array<Layer> {
    const boardContent = new Array<Layer>();
    const layer = new Layer({ visible: true, draggable: true });
    boardContent.push(layer);

    layer.shapes.push(
      new Shape({
        componentName: "v-rect",
        name: "background",
        x: 2,
        y: 2,
        width: 800,
        height: 396,
        stroke: "black",
        strokeWidth: 4,
      })
    );

    for (let i = 0; i < 20; i++) {
      layer.shapes.push(
        new Shape({
          componentName: "v-circle",
          id: `ran_${i}`,
          x: random(500) + 100,
          y: random(300) + 100,
          radius: random(50) + 10,
          fill: "red",
          stroke: "black",
          strokeWidth: 4,
        })
      );
    }
    layer.shapes.push(
      new Shape({
        componentName: "image-shape",
        x: 200,
        y: 22,
        width: 30,
        height: 30,
        image: "https://vuejs.org/images/logo.png",
        draggable: true,
      })
    );
    layer.shapes.push(
      new Shape({
        componentName: "v-circle",
        id: "c1",
        x: 450,
        y: 250,
        radius: 70,
        fill: "pink",
        stroke: "black",
        strokeWidth: 4,
      })
    );
    layer.shapes.push(
      new Shape({
        componentName: "v-circle",
        id: "c2",
        x: 70,
        y: 50,
        radius: 70,
        fill: "orange",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
        dragBoundFunc(position: Vector2d): Vector2d {
          let x = position.x;
          let y = position.y;
          if (x < 0) {
            x = 0;
          }
          if (x > 500) {
            x = 500;
          }
          if (y < 70) {
            y = 70;
          }
          if (y > 100) {
            y = 100;
          }

          return { x: x, y: y };
        },
      })
    );
    layer.shapes.push(
      new Shape({
        componentName: "v-circle",
        id: "c3",
        x: 90,
        y: 60,
        radius: 50,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
      })
    );
    return boardContent;
  }
}