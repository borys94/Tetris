import { TetrominoType, type Rotation } from './tetrominos/shapes'
import type Tetromino from './tetrominos/tetromino'

type RotationKey = `${Rotation}>${Rotation}`
type Offset = [x: number, y: number]
type KickTable = Partial<Record<RotationKey, Offset[]>>

// https://tetris.fandom.com/wiki/SRS
class WallKickSystem {
  private kickTable: KickTable

  constructor(tetromino: Tetromino) {
    this.kickTable = this.getKickTableFor(tetromino)
  }

  getOffsets(from: Rotation, to: Rotation): Offset[] {
    const key: RotationKey = `${from}>${to}`
    return this.kickTable[key] || [[0, 0]]
  }

  private getKickTableFor(tetromino: Tetromino): KickTable {
    if (tetromino.getType() === TetrominoType.IShape) {
      return WALL_KICKS['I']
    }

    return WALL_KICKS['default']
  }
}

export default WallKickSystem

// TODO: move to separate file
const WALL_KICKS: Record<'default' | 'I', KickTable> = {
  default: {
    '0>1': [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    '1>0': [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
    '1>2': [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
    '2>1': [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    '2>3': [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
    '3>2': [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
    '3>0': [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
    '0>3': [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
  },
  I: {
    '0>1': [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, -1],
      [1, 2],
    ],
    '1>0': [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -2],
    ],
    '1>2': [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, 2],
      [2, -1],
    ],
    '2>1': [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, 1],
    ],
    '2>3': [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -2],
    ],
    '3>2': [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, -1],
      [1, 2],
    ],
    '3>0': [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, 1],
    ],
    '0>3': [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, 2],
      [2, -1],
    ],
  },
}
