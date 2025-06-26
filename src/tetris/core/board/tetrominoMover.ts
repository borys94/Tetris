import type Playfield from './playfield'
import type ActiveTetromino from './tetrominos/activeTetromino'
import WallKickSystem from './wallKickSystem'

class TetrominoMover {
  constructor(
    private playfield: Playfield,
    private tetromino: ActiveTetromino
  ) {}

  moveLeft() {
    return this.performMove('moveLeft')
  }

  moveRight() {
    return this.performMove('moveRight')
  }

  moveDown() {
    return this.performMove('moveDown')
  }

  rotateRight() {
    return this.performRotation('rotateRight')
  }

  rotateLeft() {
    return this.performRotation('rotateLeft')
  }

  private performMove(move: Extract<keyof ActiveTetromino, 'moveLeft' | 'moveRight' | 'moveDown'>) {
    const moved = this.tetromino.clone()
    moved[move]()

    if (!this.playfield.hasCollision(moved)) {
      this.tetromino[move]()
      return true
    }

    return false
  }

  private performRotation(rotation: Extract<keyof ActiveTetromino, 'rotateRight' | 'rotateLeft'>) {
    const wallKickSystem = new WallKickSystem(this.tetromino)

    const from = this.tetromino.getRotation()

    const rotated = this.tetromino.clone()
    rotated[rotation]()
    const to = rotated.getRotation()

    for (const [dx, dy] of wallKickSystem.getOffsets(from, to)) {
      const clone = this.tetromino.clone()
      clone[rotation]()
      clone.move(dx, dy)

      if (!this.playfield.hasCollision(clone)) {
        this.tetromino[rotation]()
        this.tetromino.move(dx, dy)
        return true
      }
    }

    return false
  }
}

export default TetrominoMover
