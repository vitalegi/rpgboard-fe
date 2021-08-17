import Container, { Service } from "typedi";
import CustomShape, { Grid, ShapeType } from "../models/BoardContent";
import random from "@/utils/RandomUtil";
import Asset from "@/game/assets/models/Asset";
import Board from "@/models/Board";
import BackendService from "@/services/BackendService";
import BoardElement from "@/models/BoardElement";
import { timestamp } from "@/utils/Time";
import store from "@/store";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Board.Services.BoardContentService");

type TreeNode = {
  children: Array<TreeNode>;
};

type BoardElementTree = {
  value: BoardElement | null;
  children: Array<BoardElementTree>;
};

@Service()
export default class BoardContentService {
  protected backendService = Container.get<BackendService>(BackendService);

  public async init(
    board: Board,
    elements: Array<BoardElement>
  ): Promise<void> {
    store.commit(`board/setBoard`, board);
    store.commit(`board/setElements`, elements);
  }

  public createShapesTree(elements: Array<BoardElement>): CustomShape[] {
    const tree = this.createHierarchy(elements, (element) => {
      return {
        value: element,
        children: new Array<TreeNode>(),
      };
    });
    if (tree) {
      return tree.map((root) => this.treeToShape(root as BoardElementTree));
    }
    throw new Error(`With the elements provided, no shape was built`);
  }

  protected treeToShape(element: BoardElementTree): CustomShape {
    const el = element.value;
    const shape = new CustomShape(el?.config);
    shape.children = element.children.map((e) => this.treeToShape(e));
    return shape;
  }

  public createHierarchy(
    elements: Array<BoardElement>,
    processor: (element: BoardElement) => TreeNode
  ): TreeNode[] {
    const startTime = timestamp();
    const rootElements = elements.filter((e) => e.parentId == null);
    const out = rootElements.map((root) =>
      this.createHierarchyNode(root, elements, processor)
    );
    const duration = timestamp() - startTime;
    const rounded = Math.round((duration + Number.EPSILON) * 100) / 100;

    logger.info(`Created board content tree in ${rounded}ms`);
    return out;
  }

  protected createHierarchyNode(
    current: BoardElement,
    elements: Array<BoardElement>,
    processor: (element: BoardElement) => TreeNode
  ): TreeNode {
    const element = processor(current);
    const reducedElements = elements
      .filter((e) => e.parentId != current.entryId)
      .filter((e) => e.entryId != current.entryId);

    element.children = elements
      .filter((e) => e.parentId == current.entryId)
      .map((child) =>
        this.createHierarchyNode(child, reducedElements, processor)
      );
    return element;
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

  public async update(entry: BoardElement): Promise<void> {
    logger.info(`update board entry ${entry.entryId}`);
    const board = store.getters["board/board"] as Board;
    // try to update backend, if succeed, update locally
    const out = await this.backendService.updateBoardElement(
      board.boardId,
      entry
    );
    store.commit(`board/updateElement`, out);
  }

  public async delete(entryId: string): Promise<void> {
    logger.info(`delete board entry ${entryId}`);
    const board = store.getters["board/board"] as Board;
    // try to update backend, if succeed, update locally
    const out = await this.backendService.deleteBoardElement(
      board.boardId,
      entryId
    );
    store.commit(`board/deleteElement`, entryId);
  }

  protected findElementIndexById(
    elements: BoardElement[],
    entryId: string
  ): number {
    const entryIndex = elements.findIndex((e) => e.entryId == entryId);
    if (entryIndex === -1) {
      throw new Error(`Cannot find element ${entryId} in board.`);
    }
    return entryIndex;
  }

  protected findElementById(
    elements: BoardElement[],
    entryId: string
  ): BoardElement {
    return elements[this.findElementIndexById(elements, entryId)];
  }

  public updateVisibility(entryId: string): void {
    const elements = store.getters["board/elements"] as BoardElement[];
    const entry = this.findElementById(elements, entryId);
    entry.config.visible = !entry.config.visible;
    this.update(entry);
  }

  public createLayer(name: string): CustomShape {
    return new CustomShape({
      componentName: ShapeType.LAYOUT,
      visible: true,
      draggable: true,
    });
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
      id: `image-${asset.assetId}-${random(1000000)}`,
      x: 0,
      y: 0,
      image: image,
      draggable: false,
      visible: true,
    });
    if (asset.metadata.width > 0) {
      shape.config.width = asset.metadata.width;
    }
    if (asset.metadata.height > 0) {
      shape.config.height = asset.metadata.height;
    }

    return shape;
  }

  public async addImage(
    boardId: string,
    asset: Asset,
    parentId: string,
    entryPosition: number
  ): Promise<void> {
    logger.info(
      `Adding image, board=${boardId}, asset=${asset.assetId}, parentId=${parentId}, entryPosition=${entryPosition}`
    );
    const config: any = {
      componentName: ShapeType.IMAGE,
      x: 0,
      y: 0,
      name: asset.name,
      assetId: asset.assetId,
      draggable: true,
      visible: true,
    };
    if (asset.metadata.width > 0) {
      config.width = asset.metadata.width;
    }
    if (asset.metadata.height > 0) {
      config.height = asset.metadata.height;
    }
    await this.addElement(boardId, config, parentId, entryPosition);
  }

  public async addGroup(
    boardId: string,
    name: string,
    parentId: string,
    entryPosition: number
  ): Promise<void> {
    const config = {
      componentName: ShapeType.GROUP,
      name: name,
      x: 0,
      y: 0,
      visible: true,
      draggable: true,
    };
    this.addElement(boardId, config, parentId, entryPosition);
  }

  public async addLayer(
    boardId: string,
    name: string,
    entryPosition: number
  ): Promise<void> {
    const config = {
      componentName: ShapeType.LAYOUT,
      name: name,
      x: 0,
      y: 0,
      visible: true,
      draggable: true,
    };
    this.addElement(boardId, config, null, entryPosition);
  }

  async addElement(
    boardId: string,
    config: any,
    parentId: string | null,
    entryPosition: number
  ): Promise<void> {
    const entry = await this.backendService.addBoardElement(
      boardId,
      config,
      parentId,
      "PRIVATE",
      "PUBLIC",
      entryPosition
    );
    store.commit("board/addElement", entry);
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
