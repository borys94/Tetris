import Shape from "../Shape";
import ShapeOnBoard from "./ShapeOnBoard";
import copy from "../../helpers/copy";

const NEXT_SHAPES_COUNT = 4;

export enum BoardAction {
  GameOver,
  ColisionInNextStep,
  ShapeAdded,
  ReduceRows,
  UpdateBoard,
}

type Callback = (action: BoardAction, data?: any) => void;

export default class Board {
  heap: number[][];

  private shape: Shape;
  private shapeOnBoard: ShapeOnBoard;
  private nextShapes: Shape[] = [];

  private callback: Callback;

  constructor(
    private width: number,
    private height: number,
    callback: Callback
  ) {
    this.heap = new Array(this.height).fill(new Array(this.width).fill(0));
    this.callback = callback;

    this.shape = Shape.createRandomShape();
    this.shapeOnBoard = new ShapeOnBoard(this.shape, this);
    this.nextShapes = this.prepareNextShapes();
  }

  nextStep() {
    this.tryReduce();
    if (this.shapeOnBoard.colisionInNextStep()) {
      this.addShapeToBoard();
      this.addNextShape();
      this.updateShapeOnBoard();
    } else {
      this.moveDown();
    }
    this.callback(BoardAction.UpdateBoard);
  }

  moveDown() {
    this.shapeOnBoard.moveDown();
    this.callback(BoardAction.UpdateBoard);
  }

  moveLeft() {
    this.shapeOnBoard.moveLeft();
    this.callback(BoardAction.UpdateBoard);
  }

  moveRight() {
    this.shapeOnBoard.moveRight();
    this.callback(BoardAction.UpdateBoard);
  }

  rotate() {
    this.shapeOnBoard.rotate();
    this.callback(BoardAction.UpdateBoard);
  }

  hardDrop() {
    let counter = 0;
    while (!this.shapeOnBoard.colisionInNextStep()) {
      counter++;
      this.moveDown();
    }
    this.callback(BoardAction.UpdateBoard);
    return counter;
  }

  getNextShapes() {
    return this.nextShapes;
  }

  getHeap(): number[][] {
    return copy(this.shapeOnBoard.getHeap());
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  tryReduce() {
    let reducedRows = 0;
    for (let y in this.heap) {
      let allInRow = true;
      for (let x in this.heap[+y]) {
        if (this.heap[y][x] === 0) {
          allInRow = false;
        }
      }
      if (allInRow) {
        this.reduceLine(+y);
        reducedRows++;
      }
    }
    this.callback(BoardAction.ReduceRows, reducedRows);
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
    this.callback(BoardAction.ShapeAdded);
  }

  private addNextShape() {
    this.shape = this.nextShapes[0];
    this.nextShapes.shift();
    this.nextShapes.push(Shape.createRandomShape());
  }

  private updateShapeOnBoard() {
    this.shapeOnBoard = new ShapeOnBoard(this.shape, this);
    if (!this.shapeOnBoard.canMove(0, 1)) {
      this.callback(BoardAction.GameOver);
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
}
