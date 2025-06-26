import GameState from "../gameState"
import { PlayingStateType } from "./playingStateMachine"

export default class ClearingLinesState extends GameState<PlayingStateType> {
  private clearTimer: number = 0
  private clearDelay: number = 300 // Time to show lines before clearing
  private linesToClear: number[] = []

  update(deltaTime: number): void {
    this.clearTimer += deltaTime

    if (this.clearTimer >= this.clearDelay) {
      // Clear the lines
      this.clearLines()
    }
  }

  handleInput(): void {
    // No input handling during line clearing
  }

  render(): void {
    // renderer.render()
    // Could add visual effects here for lines being cleared
  }

  enter(): void {
    console.log('Entering Clearing Lines State')
    this.clearTimer = 0
    this.linesToClear = this.getLinesToClear()
  }

  exit(): void {
    console.log('Exiting Clearing Lines State')
  }

  getTransition(): PlayingStateType | null {
    if (this.clearTimer >= this.clearDelay) {
      // Check if there are lines to clear
      if (this.linesToClear.length > 0) {
        return PlayingStateType.LINE_CLEAR_ANIMATION
      } else {
        return PlayingStateType.SPAWNING
      }
    }
    
    return null
  }

  private getLinesToClear() {
    const playfield = this.gameCore.getBoard().getPlayfield()
    const blocks = playfield.getBlocks()
    const width = playfield.getWidth()
    const height = playfield.getHeight()
    const linesToReduce: number[] = []

    for (let y = 0; y < height; y++) {
      if (blocks.filter(([, by]) => by === y).length === width) {
        linesToReduce.push(y)
      }
    }

    return linesToReduce
  }

  private clearLines(): void {
    if (this.linesToClear.length > 0) {
      const playfield = this.gameCore.getBoard().getPlayfield()
      
      // Clear the lines
      playfield.clearLines()
      
      // Update scoring and level
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.gameCore.getScoring().addClearedLines(this.linesToClear.length as any)
      this.gameCore.getLevel().addClearedLines(this.linesToClear.length)
    }
  }
} 