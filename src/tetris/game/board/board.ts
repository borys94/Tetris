import Tetromino from './tetrominos/tetromino'
import config from '../../config'
import Playfield from './playfield'
import ActiveTetromino from './tetrominos/activeTetromino'
import { TetrominoType } from './tetrominos/shapes'
import TetrominoMover from './tetrominoMover'

const QUEUE_SIZE = 4

// https://tetris.fandom.com/wiki/Tetris_Guideline
export default class Board {
  private playfield: Playfield
  private tetrominoQueue: Tetromino[]
  private activeTetromino: ActiveTetromino

  constructor() {
    this.playfield = new Playfield(config.board.bricksX, config.board.bricksY)
    this.tetrominoQueue = this.generateQueue()
    this.activeTetromino = this.nextTetromino()
  }

  moveDown() {
    return new TetrominoMover(this.playfield, this.activeTetromino).moveDown()
  }

  moveLeft() {
    return new TetrominoMover(this.playfield, this.activeTetromino).moveLeft()
  }

  moveRight() {
    return new TetrominoMover(this.playfield, this.activeTetromino).moveRight()
  }

  rotateRight() {
    return new TetrominoMover(this.playfield, this.activeTetromino).rotateRight()
  }

  rotateLeft() {
    return new TetrominoMover(this.playfield, this.activeTetromino).rotateLeft()
  }

  mergeActiveTetromino() {
    this.playfield.merge(this.activeTetromino)
    this.activeTetromino = this.nextTetromino()
  }

  hasCollisionInNextStep() {
    const moved = this.activeTetromino.clone()
    moved.moveDown()
    return this.playfield.hasCollision(moved)
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
    return Array.from({ length: QUEUE_SIZE }, () => this.generateTetromino())
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
