import Shape from "./Shape";
import Board from "./Board";
import copy from "../helpers/copy";

export default class ShapeOnBoard {
  private positionX: number;
  private positionY: number;

  constructor(private shape: Shape, private board: Board) {
    this.positionX = Math.floor(board.getWidth() / 2) - 2;
    this.positionY = -2;
  }

  colisionInNextStep() {
    return !this.canMove(0, 1);
  }

  getPositionX() {
    return this.positionX;
  }

  getPositionY() {
    return this.positionY;
  }

  canRotate() {
    return (
      this.canMove(0, 0, true) ||
      this.canMove(-1, 0, true) ||
      this.canMove(1, 0, true)
    );
  }

  rotate() {
    if (!this.canRotate()) {
      return;
    }

    if (!this.canMove(0, 0, true)) {
      if (this.canMove(1, 0, true)) {
        this.positionX++;
      } else if (this.canMove(-1, 0, true)) {
        this.positionX--;
      }
    }
    this.shape.rotate();
  }

  moveDown() {
    if (this.canMove(0, 1)) {
      this.positionY++;
    }
  }

  moveToBottom() {
    let index = 0;
    while (true) {
      if (this.canMove(0, index)) {
        index++;
      } else {
        this.positionY += index - 1;
        break;
      }
    }
  }

  moveLeft() {
    if (this.canMove(-1, 0)) {
      this.positionX--;
    }
  }

  moveRight() {
    if (this.canMove(1, 0)) {
      this.positionX++;
    }
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
          (this.positionY + +y + yShift >= this.board.getHeight() ||
            this.positionY + +y + yShift < 0 ||
            this.positionX + +x + xShift < 0 ||
            this.positionX + +x + xShift >= this.board.getWidth() ||
            heap[this.positionY + +y + yShift][this.positionX + +x + xShift] !==
              0)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  getHeap() {
    const heap = copy(this.board.getHeap()) as number[][];
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

    return heap;
  }
}
