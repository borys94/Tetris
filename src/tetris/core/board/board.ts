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
    console.log('rotateLeft')
    return this.tetrominoMover.rotateLeft()
  }

  mergeActiveTetromino() {
    this.playfield.merge(this.activeTetromino)
  }

  spawnTetromino() {
    this.activeTetromino = this.nextTetromino()
    this.tetrominoMover = new TetrominoMover(this.playfield, this.activeTetromino)
  }

  hasCollisionInNextStep() {
    const moved = this.activeTetromino.clone()
    moved.moveDown()
    return this.playfield.hasCollision(moved)
  }

  /**
   * Detect T-Spin after a rotation
   */
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

  getGhostTetromino() {
    let ghostTetromino = this.activeTetromino.clone()
    const moved = ghostTetromino.clone()
    while (!this.playfield.hasCollision(moved)) {
      ghostTetromino = moved.clone()
      moved.moveDown()
    }

    return ghostTetromino
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
    this.tetrominoQueue.push(this.generateTetromino())
    return new ActiveTetromino(topTetromino)
  }

  private generateTetromino() {
    const enumValues = Object.keys(TetrominoType)
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const color = Math.floor(Math.random() * config.bricks.length) + 1
    return new Tetromino(enumValues[randomIndex] as unknown as TetrominoType, color)
  }
}
