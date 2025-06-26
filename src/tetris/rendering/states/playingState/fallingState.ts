import type { InputType } from "../../../inputHandler"
import { drawPlayfield, drawPlayfieldBackground, drawTetromino } from "../../renderers/board"
import GameState from "../gameState"
import { PlayingStateType } from "./playingStateMachine"

type MoveType = 'left' | 'right' | 'rotateRight' | 'rotateLeft' | null

export default class FallingState extends GameState<PlayingStateType> {
  private dropTimer: number = 0
  private dropInterval: number = 1000
  private softDropInterval: number = 100
  private softDropping: boolean = false
  private hardDroppingBlocked: boolean = false

  private moveInterval: number = 500
  private moveTimer: number = 0
  private moveType: MoveType = null


  update(deltaTime: number): void {
    this.dropTimer += deltaTime

    // Auto-drop based on level
    const currentLevel = this.gameCore.getLevel().getLevel()
    this.dropInterval = Math.max(50, 1000 - (currentLevel - 1) * 50)

    const dropInterval = this.softDropping ? this.softDropInterval : this.dropInterval

    if (this.dropTimer >= dropInterval) {
      this.dropTimer = 0

      if (this.gameCore.getBoard().hasCollisionInNextStep()) {
        // Tetromino has landed, transition to locking state
        return
      } else {
        if (this.softDropping) {
          this.gameCore.getScoring().addSoftDropPoints(1)
        }
        this.gameCore.getBoard().moveDown()
      }
    }

    // Handle continuous movement
    if (this.moveType) {
      this.moveTimer += deltaTime
      if (this.moveTimer >= this.moveInterval) {
        this.moveTimer = 0
        this.performMove(this.moveType)
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
      this.setMoveType(null)
    }

    // Handle movement inputs
    if (inputs.includes('ArrowLeft')) {
      this.setMoveType('left')
    }
    if (inputs.includes('ArrowRight')) {
      this.setMoveType('right')
    }
    if (inputs.includes('ArrowUp')) {
      this.setMoveType('rotateRight')
    }
    if (inputs.includes('KeyZ')) {
      this.setMoveType('rotateLeft')
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
      }
    } else {
      this.hardDroppingBlocked = false
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfieldBackground(ctx)
    drawPlayfield(ctx, this.gameCore.getBoard().getPlayfield())
    drawTetromino(ctx, this.gameCore.getBoard().getActiveTetromino(), false)
    drawTetromino(ctx, this.gameCore.getBoard().getGhostTetromino(), true)
  }

  enter(): void {
    super.enter()
    console.log('Entering Falling State')
  }

  exit(): void {
    console.log('Exiting Falling State')
  }

  getTransition(): PlayingStateType | null {
    const board = this.gameCore.getBoard()
    
    // Check if tetromino has landed
    if (board.hasCollisionInNextStep()) {
      return PlayingStateType.LOCKING
    }
    
    return null
  }

  private setMoveType(moveType: MoveType): void {
    if (this.moveType !== moveType) {
      this.moveType = moveType
      this.moveTimer = 0
      this.performMove(moveType)
    }
  }

  private performMove(moveType: MoveType): void {
    switch (moveType) {
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