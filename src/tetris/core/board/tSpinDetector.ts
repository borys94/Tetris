import type ActiveTetromino from './tetrominos/activeTetromino'
import type Playfield from './playfield'
import { TetrominoType } from './tetrominos/shapes'

export interface TSpinResult {
  isTSpin: boolean
  isMiniTSpin: boolean
  cornerCount: number
}

export default class TSpinDetector {
  constructor(
    private playfield: Playfield,
    private tetromino: ActiveTetromino
  ) {}

  /**
   * Detects T-Spin after a rotation
   * T-Spin occurs when:
   * 1. The tetromino is a T-piece
   * 2. The tetromino is locked in place (can't move down)
   * 3. The rotation was the last move before locking
   * 4. At least 3 of the 4 corner cells around the T-piece center are occupied
   */
  detectTSpin(lastMoveWasRotation: boolean): TSpinResult {
    // Only T-pieces can perform T-spins

    if (this.tetromino.getType() !== TetrominoType.TShape) {
      return { isTSpin: false, isMiniTSpin: false, cornerCount: 0 }
    }

    // T-spin only occurs when the piece is locked and the last move was a rotation
    if (!this.isLocked() || !lastMoveWasRotation) {
      return { isTSpin: false, isMiniTSpin: false, cornerCount: 0 }
    }

    const cornerCount = this.getCornerCount()

    // Full T-spin: 3 or 4 corners occupied
    if (cornerCount >= 3) {
      return { isTSpin: true, isMiniTSpin: false, cornerCount }
    }

    // Mini T-spin: 2 corners occupied
    if (cornerCount === 2) {
      return { isTSpin: false, isMiniTSpin: true, cornerCount }
    }

    return { isTSpin: false, isMiniTSpin: false, cornerCount }
  }

  /**
   * Check if the tetromino is locked (can't move down)
   */
  private isLocked(): boolean {
    const moved = this.tetromino.clone()
    moved.moveDown()
    return this.playfield.hasCollision(moved)
  }

  /**
   * Count how many of the 4 corner cells around the T-piece center are occupied
   */
  private getCornerCount(): number {
    const blocks = this.tetromino.getBlocks()
    if (blocks.length === 0) return 0

    // For T-piece, the center is the middle block (the one that's not at the ends)
    // T-piece has 4 blocks in a T shape, so we need to find the center
    const sortedByX = [...blocks].sort(([x1], [x2]) => x1 - x2)
    const sortedByY = [...blocks].sort(([, y1], [, y2]) => y1 - y2)

    // The center is the middle block in both X and Y directions
    const centerX = sortedByX[1][0] // Middle X position
    const centerY = sortedByY[1][1] // Middle Y position

    // Define the 4 corner positions relative to the center
    const corners = [
      [centerX - 1, centerY - 1], // top-left
      [centerX + 1, centerY - 1], // top-right
      [centerX - 1, centerY + 1], // bottom-left
      [centerX + 1, centerY + 1], // bottom-right
    ]

    let occupiedCorners = 0

    for (const [cornerX, cornerY] of corners) {
      if (this.isCornerOccupied(cornerX, cornerY)) {
        occupiedCorners++
      }
    }

    return occupiedCorners
  }

  /**
   * Check if a corner position is occupied by a block or wall
   */
  private isCornerOccupied(x: number, y: number): boolean {
    // Check if position is outside the playfield (wall)
    if (x < 0 || x >= this.playfield.getWidth() || y >= this.playfield.getHeight()) {
      return true
    }

    // Check if position is above the playfield (not occupied)
    if (y < 0) {
      return false
    }

    // Check if position is occupied by a placed block
    const blocks = this.playfield.getBlocks()
    return blocks.some(([blockX, blockY]) => blockX === x && blockY === y)
  }
}
