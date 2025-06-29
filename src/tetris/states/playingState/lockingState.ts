import type { InputType } from '../../inputHandler'
import { PlayingStateType } from './playingStateMachine'
import State from '../state'
import { drawPlayfield } from '../../helpers/rendering'
import { drawTetromino } from '../../helpers/rendering'

type ContinousMoveType = 'left' | 'right' | 'rotateRight' | 'rotateLeft' | null

export default class LockingState extends State<PlayingStateType> {
  private lockTimer: number = 0
  private lockDelay: number = 700 // 700ms to allow for last-minute moves

  private continuousMoveType: ContinousMoveType = null
  private moveTimer: number = 0
  private moveInterval: number = 500

  update(deltaTime: number): void {
    this.lockTimer += deltaTime

    if (this.board.canActiveTetrominoMoveDown()) {
      this.setTransition(PlayingStateType.FALLING)
      return
    }

    if (this.lockTimer >= this.lockDelay) {
      this.handleLockDelayExpired()
    } else {
      this.updateContinuousMove(deltaTime)
    }
  }  

  handleInput(inputs: InputType[]): void {
    if (
      !inputs.includes('ArrowLeft') &&
      !inputs.includes('ArrowRight') &&
      !inputs.includes('ArrowUp') &&
      !inputs.includes('KeyZ')
    ) {
      this.setContinuousMoveType(null)
    }

    // Handle movement inputs
    if (inputs.includes('ArrowLeft')) {
      this.setContinuousMoveType('left')
    }
    if (inputs.includes('ArrowRight')) {
      this.setContinuousMoveType('right')
    }
    if (inputs.includes('ArrowUp')) {
      this.setContinuousMoveType('rotateRight')
    }
    if (inputs.includes('KeyZ')) {
      this.setContinuousMoveType('rotateLeft')
    }

    // Hold tetromino
    if (inputs.includes('KeyC')) {
      this.board.holdTetromino()
    }

    if (inputs.includes('ArrowDown')) {
      // Soft drop during lock delay
      this.board.moveDown()
      this.scoring.addSoftDropPoints(1)
      this.lockTimer = 0 // Reset lock timer
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfield(ctx, this.board.getPlayfield())
    drawTetromino(ctx, this.board.getActiveTetromino(), true)
  }

  enter(): void {
    super.enter()
    this.lockTimer = 0
    this.moveTimer = 0
  }

  private handleLockDelayExpired(): void {
    this.board.mergeActiveTetromino()

    if (this.board.getPlayfield().hasLineToClear()) {
      this.setTransition(PlayingStateType.CLEARING_LINES)
    } else {
      this.handleNoLinesCleared()
    }
  }

  private handleNoLinesCleared(): void {
    this.scoring.setCombo(0)
    this.board.spawnTetromino()
    this.setTransition(PlayingStateType.FALLING)
  }

  private updateContinuousMove(deltaTime: number): void {
    if (this.continuousMoveType) {
      this.moveTimer += deltaTime
      if (this.moveTimer >= this.moveInterval) {
        this.moveTimer = 0
        this.performContinuousMove(this.continuousMoveType)
      }
    }
  }

  private setContinuousMoveType(continuousMoveType: ContinousMoveType): void {
    if (this.continuousMoveType !== continuousMoveType) {
      this.continuousMoveType = continuousMoveType
      this.moveTimer = 0
      this.performContinuousMove(continuousMoveType)
    }
  }

  private performContinuousMove(continuousMoveType: ContinousMoveType): void {
    switch (continuousMoveType) {
      case 'left':
        this.board.moveLeft()
        break
      case 'right':
        this.board.moveRight()
        break
      case 'rotateRight':
        this.board.rotateRight()
        break
      case 'rotateLeft':
        this.board.rotateLeft()
        break
    }
  }
}
