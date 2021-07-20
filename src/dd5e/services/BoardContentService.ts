import { Service } from "typedi";
import { Shape, Layer, Group } from "@/models/BoardContent";
import random from "@/utils/RandomUtil";
import { Vector2d } from "konva/types/types";

@Service()
export default class BoardContentService {
  public createBoardContent(): Array<Layer> {
    const boardContent = new Array<Layer>();
    const layer = new Layer({ id: "layer-1", visible: true, draggable: true });
    boardContent.push(layer);

    const backgroundGroup = new Group({
      componentName: "v-group",
      id: "background-group",
      name: "background-group",
      x: 0,
      y: 0,
      visible: true,
    });
    layer.shapes.push(backgroundGroup);

    backgroundGroup.children.push(
      new Shape({
        componentName: "v-rect",
        id: "background",
        name: "background",
        x: 2,
        y: 2,
        width: 800,
        height: 396,
        stroke: "black",
        fill: "white",
        strokeWidth: 4,
        visible: true,
      })
    );

    const gridGroup = new Group({
      componentName: "v-group",
      id: "grid-group",
      name: "grid-group",
      x: 0,
      y: 0,
      visible: true,
    });

    backgroundGroup.children.push(gridGroup);

    const gridStep = 50;
    for (let x = gridStep; x < 800; x += gridStep) {
      gridGroup.children.push(
        new Shape({
          componentName: "v-line",
          id: `grid-vertical-${x}`,
          points: [x, 0, x, 400],
          stroke: "black",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round",
          visible: true,
        })
      );
    }
    for (let y = gridStep; y < 400; y += gridStep) {
      backgroundGroup.children.push(
        new Shape({
          componentName: "v-line",
          id: `grid-vertical-${y}`,
          points: [0, y, 800, y],
          stroke: "black",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round",
          visible: true,
        })
      );
    }

    for (let i = 0; i < 50; i++) {
      backgroundGroup.children.push(
        new Shape({
          componentName: "v-circle",
          id: `random-circle-${i}`,
          x: random(500) + 100,
          y: random(300) + 100,
          radius: random(50) + 10,
          fill: "red",
          stroke: "black",
          strokeWidth: 4,
          visible: true,
        })
      );

      backgroundGroup.children.push(
        new Shape({
          componentName: "image-shape",
          id: `random-image-${i}`,
          x: random(500) + 100,
          y: random(300) + 100,
          width: 20,
          height: 20,
          image: "https://vuejs.org/images/logo.png",
          draggable: true,
          visible: true,
        })
      );
    }
    backgroundGroup.children.push(
      new Shape({
        componentName: "image-shape",
        id: "big-image",
        x: 200,
        y: 22,
        width: 60,
        height: 60,
        image: "https://vuejs.org/images/logo.png",
        draggable: true,
        visible: true,
      })
    );
    backgroundGroup.children.push(
      new Shape({
        componentName: "v-circle",
        id: "pink-circle",
        x: 450,
        y: 250,
        radius: 70,
        fill: "pink",
        stroke: "black",
        strokeWidth: 4,
        visible: true,
      })
    );
    backgroundGroup.children.push(
      new Shape({
        componentName: "v-circle",
        id: "yellow-circle",
        x: 90,
        y: 60,
        radius: 50,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
        visible: true,
      })
    );
    return boardContent;
  }
}
