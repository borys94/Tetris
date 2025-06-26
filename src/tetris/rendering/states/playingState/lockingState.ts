import type { InputType } from "../../../inputHandler"
import { PlayingStateType } from "./playingStateMachine"
import GameState from "../gameState"

export default class LockingState extends GameState<PlayingStateType> {
  private lockTimer: number = 0
  private lockDelay: number = 500 // 500ms to allow for last-minute moves

  update(deltaTime: number): void {
    this.lockTimer += deltaTime

    if (this.lockTimer >= this.lockDelay) {
      // Lock the tetromino in place
      this.setTransition(PlayingStateType.CLEARING_LINES)
      this.gameCore.getBoard().mergeActiveTetromino()
    }
  }

  handleInput(inputs: InputType[]): void {
    const board = this.gameCore.getBoard()

    // Allow last-minute moves during lock delay
    if (inputs.includes('ArrowLeft')) {
      board.moveLeft()
      this.lockTimer = 0 // Reset lock timer
    }
    if (inputs.includes('ArrowRight')) {
      board.moveRight()
      this.lockTimer = 0 // Reset lock timer
    }
    if (inputs.includes('ArrowUp')) {
      board.rotateRight()
      this.lockTimer = 0 // Reset lock timer
    }
    if (inputs.includes('KeyZ')) {
      board.rotateLeft()
      this.lockTimer = 0 // Reset lock timer
    }
    if (inputs.includes('ArrowDown')) {
      // Soft drop during lock delay
      board.moveDown()
      this.gameCore.getScoring().addSoftDropPoints(1)
      this.lockTimer = 0 // Reset lock timer
    }
  }

  render(): void {
    // renderer.render()
  }

  enter(): void {
    super.enter()
    console.log('Entering Locking State')
    this.lockTimer = 0
  }

  exit(): void {
    console.log('Exiting Locking State')
  }
} 