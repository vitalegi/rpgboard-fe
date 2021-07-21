import { Service } from "typedi";
import CustomShape, { BoardContainer, Grid } from "@/models/BoardContent";
import random from "@/utils/RandomUtil";

@Service()
export default class BoardContentService {
  public createBoardContent(): BoardContainer {
    const container = new BoardContainer();
    container.grid = new Grid(true, 70, 0, 0);

    const layer = new CustomShape({
      id: "layer-1",
      visible: true,
      draggable: true,
    });
    container.layers.push(layer);

    const mainGroup = new CustomShape({
      componentName: "v-group",
      id: "background-group",
      name: "background-group",
      x: 0,
      y: 0,
      visible: true,
    });
    layer.children.push(mainGroup);

    mainGroup.children.push(
      new CustomShape({
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
    mainGroup.children.push(this.createGrid(container.grid, 800, 400));

    for (let i = 0; i < 50; i++) {
      mainGroup.children.push(
        new CustomShape({
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

      mainGroup.children.push(
        new CustomShape({
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
    mainGroup.children.push(
      new CustomShape({
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
    mainGroup.children.push(
      new CustomShape({
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
    mainGroup.children.push(
      new CustomShape({
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
    return container;
  }

  public createGrid(grid: Grid, width: number, height: number): CustomShape {
    const gridGroup = new CustomShape({
      componentName: "v-group",
      id: "grid-group",
      name: "grid-group",
      x: 0,
      y: 0,
      visible: grid.visible,
    });

    const gridStep = grid.gridStep;
    for (let x = gridStep; x < width; x += gridStep) {
      gridGroup.children.push(
        new CustomShape({
          componentName: "v-line",
          id: `grid-vertical-${x}`,
          points: [x, 0, x, height],
          stroke: "black",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round",
          visible: true,
        })
      );
    }
    for (let y = gridStep; y < height; y += gridStep) {
      gridGroup.children.push(
        new CustomShape({
          componentName: "v-line",
          id: `grid-horizontal-${y}`,
          points: [0, y, width, y],
          stroke: "black",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round",
          visible: true,
        })
      );
    }
    return gridGroup;
  }
}
