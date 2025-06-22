import Shape, { ShapeType } from './shape'
import Board from './board'
import config from '../../config'

export default class ShapeOnBoard {
  private positionX = Math.floor(config.board.bricksX / 2) - 2
  private positionY = -2

  constructor(
    private shape: Shape,
    private board: Board
  ) {
    if (shape.getShapeType() === ShapeType.IShape) {
      this.positionY = -1
    }
  }

  colisionInNextStep() {
    return !this.canMove(0, 1)
  }

  rotate() {
    if (!this.canRotate()) {
      return false
    }

    if (!this.canMove(0, 0, true)) {
      if (this.canMove(1, 0, true)) {
        this.positionX++
      } else if (this.canMove(-1, 0, true)) {
        this.positionX--
      }
    }
    this.shape.rotate()
    return true
  }

  moveDown() {
    if (this.canMove(0, 1)) {
      this.positionY++
    }
  }

  moveLeft() {
    const canMove = this.canMove(-1, 0)
    if (canMove) {
      this.positionX--
    }
    return canMove
  }

  moveRight() {
    const canMove = this.canMove(1, 0)
    if (canMove) {
      this.positionX++
    }
    return canMove
  }

  canMove(xShift: number, yShift: number, rotated = false) {
    const heap = this.board.getHeap()
    const shape = rotated ? this.shape.getRotatedShape() : this.shape.getPositions()

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (
          shape[y][x] &&
          (this.positionY + y + yShift >= config.board.bricksY ||
            this.positionY + y + yShift < -3 ||
            this.positionX + x + xShift < 0 ||
            this.positionX + x + xShift >= config.board.bricksX ||
            (this.positionY + y + yShift >= 0 &&
              heap[this.positionY + y + yShift][this.positionX + x + xShift] !== 0))
        ) {
          return false
        }
      }
    }
    return true
  }

  getShapeOnEmptyBoard(): number[][] {
    const heap = this.createEmptyBoard()
    const shape = this.shape.getPositions()

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (shape[y][x] && this.positionX + x >= 0 && this.positionY + y >= 0) {
          heap[this.positionY + y][this.positionX + x] = shape[y][x]
        }
      }
    }

    return heap
  }

  getShadowOnEmptyBoard() {
    const heap = this.createEmptyBoard()
    const shape = this.shape.getPositions()

    if (this.positionY < -2) {
      return heap
    }

    let counter = 0
    while (this.canMove(0, counter + 1)) {
      counter++
    }
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (
          shape[y][x] &&
          this.positionX + x >= 0 &&
          this.positionY + y + counter >= 0 &&
          heap[this.positionY + y + counter][this.positionX + x] === 0
        ) {
          heap[this.positionY + y + counter][this.positionX + x] = -1
        }
      }
    }

    return heap
  }

  private canRotate() {
    return this.canMove(0, 0, true) || this.canMove(-1, 0, true) || this.canMove(1, 0, true)
  }

  private createEmptyBoard(): number[][] {
    return new Array(config.board.bricksY)
      .fill([])
      .map(() => new Array(config.board.bricksX).fill(0))
  }
}
