import shapes, { TetrominoType, type TetrominoBlock } from './shapes'

export default class Tetromino {
  constructor(
    protected type: TetrominoType,
    protected color: number
  ) {}

  getType() {
    return this.type
  }

  getColor() {
    return this.color
  }

  getBlocks() {
    const color = this.getColor()
    return this.getCurrentShape()
      .map((row, dy) =>
        row
          .map((val, dx) => {
            if (val) return [dx, dy, color] as TetrominoBlock
          })
          .filter((v) => v !== undefined)
      )
      .flat()
  }

  clone() {
    const copy = new Tetromino(this.type, this.color)
    return copy as this
  }

  protected getCurrentShape() {
    return shapes[this.type][0]
  }
}
