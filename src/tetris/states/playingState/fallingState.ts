import type { InputType } from '../../inputHandler'
import { drawPlayfield, drawTetromino } from '../../helpers/rendering'
import State from '../state'
import { PlayingStateType } from './playingStateMachine'

type ContinousMoveType = 'left' | 'right' | 'rotateRight' | 'rotateLeft' | null

export default class FallingState extends State<PlayingStateType> {
  private dropTimer: number = 0
  private dropInterval: number = 1000
  private softDropInterval: number = 80
  private softDropping: boolean = false
  private hardDroppingBlocked: boolean = false

  private moveInterval: number = 150
  private moveTimer: number = 0
  private continuousMoveType: ContinousMoveType = null

  update(deltaTime: number): void {
    console.log('update')
    this.dropTimer += deltaTime

    // Auto-drop based on level
    const currentLevel = this.gameCore.getLevel().getLevel()
    console.log(currentLevel)
    this.dropInterval = Math.max(50, 800 - (currentLevel - 1) * 50)

    const dropInterval = this.softDropping ? this.softDropInterval : this.dropInterval

    if (this.dropTimer >= dropInterval) {
      this.dropTimer = 0

      if (!this.gameCore.getBoard().hasCollisionInNextStep()) {
        if (this.softDropping) {
          this.gameCore.getScoring().addSoftDropPoints(1)
        }
        this.gameCore.getBoard().moveDown()
      }

      if (this.gameCore.getBoard().hasCollisionInNextStep()) {
        // Tetromino has landed, transition to locking state
        this.setTransition(PlayingStateType.LOCKING)
        return
      }
    }

    // Handle continuous movement
    if (this.continuousMoveType) {
      this.moveTimer += deltaTime
      if (this.moveTimer >= this.moveInterval) {
        this.moveTimer = 0
        this.performContinuousMove(this.continuousMoveType)
      }
    }
  }

  handleInput(inputs: InputType[]): void {
    const board = this.gameCore.getBoard()

    // Reset move type if no movement keys are pressed
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

    // Soft drop
    if (inputs.includes('ArrowDown')) {
      this.softDropping = true
    } else {
      this.softDropping = false
    }

    // Hard drop
    if (inputs.includes('Space')) {
      if (!this.hardDroppingBlocked) {
        let dropDistance = 0
        while (!board.hasCollisionInNextStep()) {
          board.moveDown()
          dropDistance++
        }
        board.mergeActiveTetromino()
        this.gameCore.getScoring().addHardDropPoints(dropDistance)
        this.hardDroppingBlocked = true

        if (this.gameCore.getBoard().getPlayfield().hasLineToClear()) {
          this.setTransition(PlayingStateType.CLEARING_LINES)
        } else {
          // No lines cleared, reset combo
          this.gameCore.getScoring().setCombo(0)
          this.setTransition(PlayingStateType.FALLING)
          board.spawnTetromino()
        }
      }
    } else {
      this.hardDroppingBlocked = false
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfield(ctx, this.gameCore.getBoard().getPlayfield())
    drawTetromino(ctx, this.gameCore.getBoard().getActiveTetromino(), false)
    drawTetromino(ctx, this.gameCore.getBoard().getGhostTetromino(), true)
  }

  enter(): void {
    super.enter()
    this.dropTimer = 0
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
