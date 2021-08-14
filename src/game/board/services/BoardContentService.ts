import Container, { Service } from "typedi";
import CustomShape, {
  BoardContainer,
  Grid,
  ShapeType,
} from "../models/BoardContent";
import random from "@/utils/RandomUtil";
import Asset from "@/game/assets/models/Asset";
import { factory } from "@/utils/ConfigLog4j";
import Board from "@/models/Board";
import BackendService from "@/services/BackendService";
import BoardElement from "@/models/BoardElement";
const logger = factory.getLogger("Game.Board.Services.BoardContentService");

class BoardElementTree {
  value: BoardElement | null = null;
  children = new Array<BoardElementTree>();
}

@Service()
export default class BoardContentService {
  protected backendService = Container.get<BackendService>(BackendService);

  public async initBoard(board: Board): Promise<BoardContainer> {
    const elements = await this.backendService.getBoardElements(board.boardId);

    const container = new BoardContainer();
    container.grid = new Grid(true, 70, 0, 0);

    const layer = new CustomShape({
      componentName: ShapeType.LAYOUT,
      id: "layer-N",
      visible: true,
      draggable: true,
    });
    container.layers.push(layer);
    this.createTree(elements);
    return container;
  }

  protected createTree(elements: Array<BoardElement>): BoardElementTree {
    logger.info("Create board tree");
    const root = elements.filter((e) => e.parentId == null)[0];
    const out = this.createTreeElement(root, elements);
    logger.info("Create board tree - end");
    console.log(out);
    return out;
  }

  protected createTreeElement(
    parent: BoardElement,
    elements: Array<BoardElement>
  ): BoardElementTree {
    const element = new BoardElementTree();
    element.value = parent;
    const reducedElements = elements
      .filter((e) => e.parentId != parent.entryId)
      .filter((e) => e.entryId != parent.entryId);

    element.children = elements
      .filter((e) => e.parentId == parent.entryId)
      .map((child) => this.createTreeElement(child, reducedElements));
    return element;
  }

  public createBoardContent(): BoardContainer {
    const container = new BoardContainer();
    container.grid = new Grid(true, 70, 0, 0);

    const layer = new CustomShape({
      componentName: ShapeType.LAYOUT,
      id: "layer-1",
      visible: true,
      draggable: true,
    });
    container.layers.push(layer);

    const mainGroup = new CustomShape({
      componentName: ShapeType.GROUP,
      id: "background-group",
      name: "background-group",
      x: 0,
      y: 0,
      visible: true,
    });
    layer.children.push(mainGroup);

    mainGroup.children.push(
      new CustomShape({
        componentName: ShapeType.RECTANGLE,
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
          componentName: ShapeType.CIRCLE,
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
          componentName: ShapeType.IMAGE,
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
        componentName: ShapeType.IMAGE,
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
        componentName: ShapeType.CIRCLE,
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
        componentName: ShapeType.CIRCLE,
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
      componentName: ShapeType.GROUP,
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
          componentName: ShapeType.LINE,
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
          componentName: ShapeType.LINE,
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

  public updateDraggable(content: BoardContainer, id: string): void {
    const target = this.getElementById(content.layers, id);
    if (target === null) {
      throw new Error(`Cannot find element ${id} in board.`);
    }
    target.config.draggable = !target.config.draggable;
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
    referenceId: string,
    asset: CustomShape
  ): void {
    const reference = this.getElementById(content.layers, referenceId);
    if (reference === null) {
      throw new Error(`Cannot find element ${referenceId} in board.`);
    }
    if (ShapeType.isFolder(reference)) {
      logger.info(`Inserting in a folder`);
      reference.children.push(asset);
    } else {
      logger.info(`Inserting near an asset`);
      const parent = this.getParentById(content.layers, referenceId);
      if (parent === null) {
        throw new Error(`"Cannot find parent for ${referenceId} in board`);
      }
      const index = parent?.children.findIndex(
        (e) => e.config.id === referenceId
      );
      if (index === undefined) {
        throw new Error(
          `Cannot find index for ${referenceId} in ${parent.config.id}`
        );
      }
      parent.children.splice(index + 1, 0, asset);
    }
  }

  public createGroup(name: string): CustomShape {
    return new CustomShape({
      componentName: ShapeType.GROUP,
      id: `group-${random(1000000)}`,
      name: name,
      x: 0,
      y: 0,
      visible: true,
      draggable: true,
    });
  }

  public async createImage(asset: Asset, image: string): Promise<CustomShape> {
    const shape = new CustomShape({
      componentName: ShapeType.IMAGE,
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
