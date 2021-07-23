import { Service } from "typedi";
import CustomShape, { BoardContainer, Grid } from "@/models/BoardContent";
import random from "@/utils/RandomUtil";
import { factory } from "@/utils/ConfigLog4j";
import Asset from "@/game/game-assets/models/Asset";
const logger = factory.getLogger("DD5e.Services.BoardContentService");

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

    for (let i = 0; i < 1; i++) {
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

  public updateVisibility(content: BoardContainer, id: string): void {
    const target = this.getElementById(content.layers, id);
    if (target === null) {
      throw new Error(`Cannot find element ${id} in board.`);
    }
    target.config.visible = !target.config.visible;
  }

  public moveNode(
    content: BoardContainer,
    id: string,
    indexVariation: number
  ): void {
    const target = this.getElementById(content.layers, id);
    if (target === null) {
      throw new Error(`Cannot find element ${id} in board.`);
    }
    const parent = this.getParentById(content.layers, id);
    if (parent === null) {
      throw new Error(`"Cannot find parent for ${id} in board`);
    }
    const oldIndex = parent?.children.findIndex((e) => e.config.id === id);
    if (oldIndex === undefined) {
      throw new Error(`Cannot find index for ${id} in ${parent.config.id}`);
    }
    const newIndex = oldIndex + indexVariation;
    if (newIndex < 0 || newIndex >= parent.children.length) {
      logger.info(`Trying to move ${id} to position ${newIndex}, skip`);
      return;
    }
    const element = parent.children.splice(oldIndex, 1)[0];
    parent.children.splice(newIndex, 0, element);
  }

  public deleteNode(content: BoardContainer, id: string): void {
    const target = this.getElementById(content.layers, id);
    if (target === null) {
      throw new Error(`Cannot find element ${id} in board.`);
    }
    const parent = this.getParentById(content.layers, id);
    if (parent === null) {
      throw new Error(`"Cannot find parent for ${id} in board`);
    }
    const index = parent?.children.findIndex((e) => e.config.id === id);
    if (index === undefined) {
      throw new Error(`Cannot find index for ${id} in ${parent.config.id}`);
    }
    parent.children.splice(index, 1)[0];
  }

  public addNode(
    content: BoardContainer,
    siblingId: string,
    asset: CustomShape
  ): void {
    const sibling = this.getElementById(content.layers, siblingId);
    if (sibling === null) {
      throw new Error(`Cannot find element ${sibling} in board.`);
    }
    const parent = this.getParentById(content.layers, siblingId);
    if (parent === null) {
      throw new Error(`"Cannot find parent for ${siblingId} in board`);
    }
    const index = parent?.children.findIndex((e) => e.config.id === siblingId);
    if (index === undefined) {
      throw new Error(
        `Cannot find index for ${siblingId} in ${parent.config.id}`
      );
    }
    parent.children.splice(index, 0, asset);
  }

  public async createImage(asset: Asset, image: string): Promise<CustomShape> {
    const shape = new CustomShape({
      componentName: "image-shape",
      id: `image-${asset.id}-${random(1000000)}`,
      x: 0,
      y: 0,
      image: image,
      draggable: false,
      visible: true,
    });
    if (asset.width > 0) {
      shape.config.width = asset.width;
    }
    if (asset.height > 0) {
      shape.config.height = asset.height;
    }

    return shape;
  }

  protected getElementById(
    elements: Array<CustomShape>,
    id: string
  ): CustomShape | null {
    for (let i = 0; i < elements.length; i++) {
      const out = this._getElementById(elements[i], id);
      if (out !== null) {
        return out;
      }
    }
    return null;
  }

  protected _getElementById(
    element: CustomShape,
    id: string
  ): CustomShape | null {
    if (element.config.id === id) {
      return element;
    }
    for (let i = 0; i < element.children.length; i++) {
      const out = this._getElementById(element.children[i], id);
      if (out !== null) {
        return out;
      }
    }
    return null;
  }

  protected getParentById(
    elements: Array<CustomShape>,
    id: string
  ): CustomShape | null {
    for (let i = 0; i < elements.length; i++) {
      const out = this._getParentById(elements[i], id);
      if (out !== null) {
        return out;
      }
    }
    return null;
  }
  protected _getParentById(
    element: CustomShape,
    id: string
  ): CustomShape | null {
    for (let i = 0; i < element.children.length; i++) {
      if (element.children[i].config.id === id) {
        return element;
      }
      const out = this._getParentById(element.children[i], id);
      if (out !== null) {
        return out;
      }
    }
    return null;
  }
}
