import Tetromino from './tetrominos/tetromino'
import config from '../../config'
import Playfield from './playfield'
import ActiveTetromino from './tetrominos/activeTetromino'
import { TetrominoType } from './tetrominos/shapes'
import TetrominoMover from './tetrominoMover'
import type { TSpinResult } from './tSpinDetector'

const QUEUE_SIZE = 4

// https://tetris.fandom.com/wiki/Tetris_Guideline
export default class Board {
  private playfield: Playfield
  private tetrominoQueue: Tetromino[]
  private activeTetromino: ActiveTetromino
  private tetrominoMover: TetrominoMover
  private heldTetromino: Tetromino | null = null
  private canHold: boolean = true

  constructor() {
    this.playfield = new Playfield(config.board.bricksX, config.board.bricksY)
    this.tetrominoQueue = this.generateQueue()
    this.activeTetromino = this.nextTetromino()
    this.tetrominoMover = new TetrominoMover(this.playfield, this.activeTetromino)
  }

  moveDown() {
    return this.tetrominoMover.moveDown()
  }

  moveLeft() {
    return this.tetrominoMover.moveLeft()
  }

  moveRight() {
    return this.tetrominoMover.moveRight()
  }

  rotateRight() {
    return this.tetrominoMover.rotateRight()
  }

  rotateLeft() {
    return this.tetrominoMover.rotateLeft()
  }

  canActiveTetrominoMoveDown() {
    return this.tetrominoMover.canMoveDown()
  }

  mergeActiveTetromino() {
    this.playfield.merge(this.activeTetromino)
  }

  spawnTetromino() {
    this.activeTetromino = this.nextTetromino()
    this.tetrominoMover = new TetrominoMover(this.playfield, this.activeTetromino)
    this.canHold = true
  }

  holdTetromino(): boolean {
    if (!this.canHold) {
      return false
    }

    const currentTetromino = new Tetromino(this.activeTetromino.getType(), this.activeTetromino.getColor())
    
    if (this.heldTetromino) {
      // Swap with held tetromino
      this.activeTetromino = new ActiveTetromino(this.heldTetromino)
      this.heldTetromino = currentTetromino
    } else {
      // First hold - just store the current tetromino and get next from queue
      this.heldTetromino = currentTetromino
      this.activeTetromino = this.nextTetromino()
    }
    
    this.tetrominoMover = new TetrominoMover(this.playfield, this.activeTetromino)
    this.canHold = false
    
    return true
  }

  detectTSpin(): TSpinResult {
    return this.tetrominoMover.detectTSpin()
  }

  getPlayfield() {
    return this.playfield
  }

  getTetrominoQueue() {
    return this.tetrominoQueue
  }

  getActiveTetromino() {
    return this.activeTetromino
  }

  getHeldTetromino() {
    return this.heldTetromino
  }

  canHoldTetromino() {
    return this.canHold
  }

  private generateQueue() {
    return [
      new Tetromino(TetrominoType.TShape, 1),
      ...Array.from({ length: QUEUE_SIZE - 1 }, () => this.generateTetromino())
    ]
  }

  private nextTetromino() {
    const topTetromino = this.tetrominoQueue.shift()
    if (!topTetromino) {
      throw new Error('No tetromino in queue. Should not happen')
    }
    this.tetrominoQueue = [...this.tetrominoQueue, this.generateTetromino()]
    return new ActiveTetromino(topTetromino)
  }

  private generateTetromino() {
    const enumValues = Object.keys(TetrominoType)
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const color = Math.floor(Math.random() * config.bricks.length) + 1
    return new Tetromino(enumValues[randomIndex] as unknown as TetrominoType, color)
  }
}
