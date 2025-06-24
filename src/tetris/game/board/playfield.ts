import type ActiveTetromino from './tetrominos/activeTetromino'
import type { TetrominoBlock } from './tetrominos/shapes'

export default class Playfield {
  private grid: number[][]
  private width: number
  private height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.grid = this.createEmptyGrid(width, height)
  }

  getWidth() {
    return this.width
  }

  getHeight() {
    return this.height
  }

  getBlocks() {
    return this.grid
      .map((row, dy) =>
        row
          .map((color, dx) => {
            if (color) return [dx, dy, color] as TetrominoBlock
          })
          .filter((v) => v !== undefined)
      )
      .flat()
  }

  hasCollision(tetromino: ActiveTetromino) {
    const blocks = tetromino.getBlocks()
    return blocks.some(([x, y]) => !this.isInside(x, y) || this.isOccupied(x, y))
  }

  merge(tetromino: ActiveTetromino) {
    tetromino.getBlocks().forEach(([x, y]) => {
      if (y >= 0) {
        this.grid[y][x] = tetromino.getColor()
      }
    })
  }

  hasLineToReduce() {
    return this.grid.some((row) => row.every((v) => v !== 0))
  }

  clearLines() {
    this.grid = this.grid.filter((row) => row.some((cell) => !cell))
    while (this.grid.length < this.height) {
      this.grid.unshift(Array(this.width).fill(0))
    }
  }

  private isInside(x: number, y: number) {
    return x >= 0 && x < this.width && y < this.height
  }

  private isOccupied(x: number, y: number) {
    return this.grid[y]?.[x] !== 0
  }

  private createEmptyGrid(width: number, height: number) {
    return Array.from({ length: height }, () => Array(width).fill(0))
  }
}
