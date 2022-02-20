import Shape from "../Shape";
import Board from "./";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../constants";

export default class ShapeOnBoard {
  private positionX: number;
  private positionY: number;

  constructor(private shape: Shape, private board: Board) {
    this.positionX = Math.floor(BOARD_WIDTH / 2) - 2;
    this.positionY = -3;
  }

  colisionInNextStep() {
    return !this.canMove(0, 1);
  }

  rotate() {
    if (!this.canRotate()) {
      return false;
    }

    if (!this.canMove(0, 0, true)) {
      if (this.canMove(1, 0, true)) {
        this.positionX++;
      } else if (this.canMove(-1, 0, true)) {
        this.positionX--;
      }
    }
    this.shape.rotate();
    return true;
  }

  moveDown() {
    if (this.canMove(0, 1)) {
      this.positionY++;
    }
  }

  moveLeft() {
    const canMove = this.canMove(-1, 0);
    if (canMove) {
      this.positionX--;
    }
    return canMove;
  }

  moveRight() {
    const canMove = this.canMove(1, 0);
    if (canMove) {
      this.positionX++;
    }
    return canMove;
  }

  canMove(xShift: number, yShift: number, rotated = false) {
    const heap = this.board.getHeap();
    const shape = rotated
      ? this.shape.getRotatedShape()
      : this.shape.getPositions();

    for (let y in shape) {
      for (let x in shape[+y]) {
        if (
          shape[y][x] &&
          (this.positionY + +y + yShift >= BOARD_HEIGHT ||
            this.positionY + +y + yShift < -3 ||
            this.positionX + +x + xShift < 0 ||
            this.positionX + +x + xShift >= BOARD_WIDTH ||
            (this.positionY + +y + yShift >= 0 &&
              heap[this.positionY + +y + yShift][
                this.positionX + +x + xShift
              ] !== 0))
        ) {
          return false;
        }
      }
    }
    return true;
  }

  getShapeOnEmptyBoard(): number[][] {
    const heap: number[][] = new Array(BOARD_HEIGHT)
      .fill([])
      .map((row) => new Array(BOARD_WIDTH).fill(0));
    const shape = this.shape.getPositions();

    for (let y in shape) {
      for (let x in shape[+y]) {
        if (
          shape[y][x] &&
          this.positionX + +x >= 0 &&
          this.positionY + +y >= 0
        ) {
          heap[this.positionY + +y][this.positionX + +x] = shape[y][x];
        }
      }
    }

    if (this.positionY < -2) {
      return heap;
    }
    let counter = 0;
    while (this.canMove(0, counter + 1)) {
      counter++;
    }
    for (let y in shape) {
      for (let x in shape[+y]) {
        if (
          shape[y][x] &&
          this.positionX + +x >= 0 &&
          this.positionY + +y + counter >= 0 &&
          heap[this.positionY + +y + counter][this.positionX + +x] === 0
        ) {
          heap[this.positionY + +y + counter][this.positionX + +x] = -1;
        }
      }
    }

    return heap;
  }

  getBoardWithoutShape(): number[][] {
    return this.board.getHeap();
  }

  getShape() {
    return this.shape;
  }

  getPositionX() {
    return this.positionX;
  }

  getPositionY() {
    return this.positionY;
  }

  private canRotate() {
    return (
      this.canMove(0, 0, true) ||
      this.canMove(-1, 0, true) ||
      this.canMove(1, 0, true)
    );
  }
}
