import Shape from "../Shape";
import ShapeOnBoard from "./ShapeOnBoard";
import copy from "../../helpers/copy";
import Eventing from "../Eventing";

const NEXT_SHAPES_COUNT = 4;

interface Action {
  gameOver: undefined;
  updateBoard: number[][];
  updateShape: number[][];
  reducedRows: number[];
  shapeAdded: undefined;
  moveShapeDown: undefined;
  rotate: boolean;
  nextShapes: number[][][];
  badMove;
}

export default class Board extends Eventing<Action> {
  private heap: number[][];

  private shape: Shape;
  private shapeOnBoard: ShapeOnBoard;
  private nextShapes: Shape[] = [];

  constructor(private width: number, private height: number) {
    super();
    this.heap = new Array(this.height).fill(new Array(this.width).fill(0));

    this.shape = Shape.createRandomShape();
    this.shapeOnBoard = new ShapeOnBoard(this.shape, this);
    this.nextShapes = this.prepareNextShapes();
  }

  nextStep() {
    if (this.shapeOnBoard.colisionInNextStep()) {
      this.addShapeToBoard();
      this.addNextShape();
      this.updateShapeOnBoard();
      this.tryReduce();
      this.trigger("updateBoard", this.getHeap());
    } else {
      this.trigger("moveShapeDown");
      this.trigger("updateBoard", this.getHeap());
      this.moveDown();
    }
  }

  onUpdateShape = () => {
    this.trigger("updateShape", this.shapeOnBoard.getShapeOnEmptyBoard());
  };

  getShapeOnEmptyBoard() {
    return this.shapeOnBoard.getShapeOnEmptyBoard();
  }

  moveDown() {
    this.shapeOnBoard.moveDown();
    this.trigger("updateShape", this.shapeOnBoard.getShapeOnEmptyBoard());
  }

  moveLeft(): boolean {
    const result = this.shapeOnBoard.moveLeft();
    if (!result) {
      this.trigger("badMove");
    } else {
      this.onUpdateShape();
    }
    return result;
  }

  moveRight(): boolean {
    const result = this.shapeOnBoard.moveRight();
    if (!result) {
      this.trigger("badMove");
    } else {
      this.onUpdateShape();
    }
    return result;
  }

  rotate() {
    const success = this.shapeOnBoard.rotate();
    this.trigger("rotate", success);
    this.onUpdateShape();
  }

  getNextShapes() {
    return this.nextShapes.map((shape) => shape.getPositions());
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  tryReduce() {
    let reducedRows: number[] = [];
    for (let y in this.heap) {
      let allInRow = true;
      for (let x in this.heap[+y]) {
        if (this.heap[y][x] === 0) {
          allInRow = false;
        }
      }
      if (allInRow) {
        this.reduceLine(+y);
        reducedRows.push(+y);
      }
    }
    if (reducedRows.length) {
      this.trigger("reducedRows", reducedRows);
      this.trigger("updateBoard", this.getHeap());

      this.onUpdateShape();
    }

    return reducedRows;
  }

  canMove(x: number, y: number) {
    return this.shapeOnBoard.canMove(x, y);
  }

  private prepareNextShapes() {
    return new Array(NEXT_SHAPES_COUNT)
      .fill(null)
      .map(() => Shape.createRandomShape());
  }

  private addShapeToBoard() {
    this.addShape(this.shapeOnBoard);
    this.trigger("shapeAdded");
  }

  private addNextShape() {
    this.shape = this.nextShapes[0];
    this.nextShapes.shift();
    this.nextShapes.push(Shape.createRandomShape());
    this.trigger(
      "nextShapes",
      this.nextShapes.map((shape) => shape.getPositions())
    );
  }

  private updateShapeOnBoard() {
    this.shapeOnBoard = new ShapeOnBoard(this.shape, this);
    if (!this.shapeOnBoard.canMove(0, 1)) {
      this.trigger("gameOver");
    }
  }

  private addShape(shapeOnBoard: ShapeOnBoard) {
    const positions = shapeOnBoard.getShape().getPositions();
    const destinationX = shapeOnBoard.getPositionX();
    const destinationY = shapeOnBoard.getPositionY();
    let heap = copy(this.heap);
    for (let y in positions) {
      for (let x in positions[+y]) {
        if (positions[y][x] && +y + destinationY >= 0) {
          heap[+y + destinationY][+x + destinationX] = positions[y][x];
        }
      }
    }
    this.heap = heap;
  }

  private reduceLine(line: number) {
    let heap = copy(this.heap);
    heap.splice(line, 1);
    heap = [new Array(this.width).fill(0), ...heap];
    this.heap = heap;
  }

  getHeap() {
    return this.heap;
  }
}
