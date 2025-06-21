import Shape, { ShapeType } from './shape'
import copy from '../../../helpers/copy'
import ShapeOnBoard from './shapeOnBoard'
import NextShapes from './nextShapes'
import config from '../../config'

// https://tetris.fandom.com/wiki/SRS
// https://tetris.fandom.com/wiki/Tetris_Guideline

export default class Board {
  private heap: number[][] // board without current shape
  private shape: Shape
  private shapeOnBoard: ShapeOnBoard
  private nextShapes: NextShapes = new NextShapes()

  constructor() {
    this.heap = new Array(config.board.bricksY - 3).fill(new Array(config.board.bricksX).fill(0))
    this.heap = [
      ...this.heap,
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    ]
    this.shape = new Shape(ShapeType.IShape, 1)
    // this.shape = Shape.createRandomShape()
    this.shapeOnBoard = new ShapeOnBoard(this.shape, this)
  }

  // nextStep() {
  //   if (this.shapeOnBoard.colisionInNextStep()) {
  //     this.addShapeToBoard()
  //     this.tryReduce()
  //   } else {
  //     this.moveDown()
  //   }
  // }

  moveDown() {
    this.shapeOnBoard.moveDown()
  }

  moveLeft() {
    return this.shapeOnBoard.moveLeft()
  }

  moveRight() {
    return this.shapeOnBoard.moveRight()
  }

  rotate() {
    return this.shapeOnBoard.rotate()
  }

  isColisionInNextStep() {
    return this.shapeOnBoard.colisionInNextStep()
  }

  getShapeOnEmptyBoard() {
    return this.shapeOnBoard.getShapeOnEmptyBoard()
  }

  getShadowOnEmptyBoard() {
    return this.shapeOnBoard.getShadowOnEmptyBoard()
  }

  getHeap() {
    return this.heap
  }

  isLineToReduce() {
    return this.heap.some((row) => row.every((v) => v !== 0))
  }

  tryReduce() {
    for (let y = 0; y < this.heap.length; y++) {
      if (this.heap[y].every((v) => v !== 0)) {
        this.reduceLine(y)
      }
    }
  }

  addShapeToBoard() {
    this.addShape()
    this.shape = this.nextShapes.shift()
    this.shapeOnBoard = new ShapeOnBoard(this.shape, this)
  }

  getNextShapes() {
    return this.nextShapes
  }

  private addShape() {
    const shape = this.shapeOnBoard.getShapeOnEmptyBoard()
    this.heap = this.heap.map((row, y) => row.map((v, x) => shape[y][x] || v))
  }

  private reduceLine(line: number) {
    const heap = copy(this.heap)
    heap.splice(line, 1)
    this.heap = [new Array(config.board.bricksX).fill(0), ...heap]
  }
}
