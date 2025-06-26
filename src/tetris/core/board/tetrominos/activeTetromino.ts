import shapes, { type Rotation, type TetrominoBlock } from './shapes'
import Tetromino from './tetromino'

export default class ActiveTetromino extends Tetromino {
  private rotation: Rotation = 0
  private x: number
  private y: number

  constructor(tetromino: Tetromino) {
    super(tetromino.getType(), tetromino.getColor())
    this.x = 0
    this.y = 0
  }

  moveLeft() {
    this.move(-1, 0)
  }

  moveRight() {
    this.move(1, 0)
  }

  moveDown() {
    this.move(0, 1)
  }

  getRotation() {
    return this.rotation
  }

  rotateRight() {
    this.rotation = this.getNextRotation()
  }

  rotateLeft() {
    this.rotation = this.getPreviousRotation()
  }

  getBlocks() {
    return super
      .getBlocks()
      .map(([x, y, color]) => [x + this.x, y + this.y, color] as TetrominoBlock)
  }

  move(dx: number, dy: number) {
    this.x += dx
    this.y += dy
  }

  clone() {
    const copy = new ActiveTetromino(this)
    copy.x = this.x
    copy.y = this.y
    copy.rotation = this.rotation
    return copy as this
  }

  protected getCurrentShape() {
    return shapes[this.type][this.rotation]
  }

  private getNextRotation() {
    return ((this.rotation + 1) % shapes[this.type].length) as Rotation
  }

  private getPreviousRotation() {
    return ((this.rotation - 1 + shapes[this.type].length) % shapes[this.type].length) as Rotation
  }
}
