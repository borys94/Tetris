import type { InputType } from '../../inputHandler'
import { PlayingStateType } from './playingStateMachine'
import State from '../state'
import { drawPlayfield } from '../../helpers/rendering'
import { drawTetromino } from '../../helpers/rendering'

type ContinousMoveType = 'left' | 'right' | 'rotateRight' | 'rotateLeft' | null

export default class LockingState extends State<PlayingStateType> {
  private lockTimer: number = 0
  private lockDelay: number = 700 // 500ms to allow for last-minute moves

  private continuousMoveType: ContinousMoveType = null
  private moveTimer: number = 0
  private moveInterval: number = 500

  update(deltaTime: number): void {
    this.lockTimer += deltaTime

    if (!this.gameCore.getBoard().hasCollisionInNextStep()) {
      this.setTransition(PlayingStateType.FALLING)
      return
    }

    // Handle continuous movement
    if (this.continuousMoveType) {
      this.moveTimer += deltaTime
      if (this.moveTimer >= this.moveInterval) {
        this.moveTimer = 0
        this.performContinuousMove(this.continuousMoveType)
      }
    }

    if (this.lockTimer < this.lockDelay) {
      return
    }

    this.gameCore.getBoard().mergeActiveTetromino()

    if (this.gameCore.getBoard().getPlayfield().hasLineToClear()) {
      this.setTransition(PlayingStateType.CLEARING_LINES)
    } else {
      // No lines cleared, reset combo
      this.gameCore.getScoring().setCombo(0)
      this.gameCore.getBoard().spawnTetromino()
      this.setTransition(PlayingStateType.FALLING)
    }
  }

  handleInput(inputs: InputType[]): void {
    const board = this.gameCore.getBoard()

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

    if (inputs.includes('ArrowDown')) {
      // Soft drop during lock delay
      board.moveDown()
      this.gameCore.getScoring().addSoftDropPoints(1)
      this.lockTimer = 0 // Reset lock timer
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfield(ctx, this.gameCore.getBoard().getPlayfield())
    drawTetromino(ctx, this.gameCore.getBoard().getActiveTetromino(), true)
    // drawTetromino(ctx, this.gameCore.getBoard().getGhostTetromino(), true)
  }

  enter(): void {
    super.enter()
    this.lockTimer = 0
    this.moveTimer = 0
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
        this.gameCore.getBoard().moveLeft()
        break
      case 'right':
        this.gameCore.getBoard().moveRight()
        break
      case 'rotateRight':
        this.gameCore.getBoard().rotateRight()
        break
      case 'rotateLeft':
        this.gameCore.getBoard().rotateLeft()
        break
    }
  }
}
