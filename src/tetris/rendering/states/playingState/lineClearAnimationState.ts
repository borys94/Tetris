import { PlayingStateType } from "./playingStateMachine"
import GameState from "../gameState"

export default class LineClearAnimationState extends GameState<PlayingStateType> {
  private animationTimer: number = 0
  private animationDuration: number = 500 // 500ms animation
  private clearedLines: number[] = []

  update(deltaTime: number): void {
    this.animationTimer += deltaTime
  }

  handleInput(): void {
    // No input handling during animation
  }

  render(): void {
    // renderer.render()
    
    // Add animation effects here
    // const progress = this.animationTimer / this.animationDuration
    // this.renderAnimationEffects(renderer, progress)
  }

  enter(): void {
    console.log('Entering Line Clear Animation State')
    this.animationTimer = 0
    // Get the lines that were cleared
    this.clearedLines = this.getClearedLines()
  }

  exit(): void {
    console.log('Exiting Line Clear Animation State')
  }

  private getClearedLines(): number[] {
    // This would return the lines that were cleared
    // For now, return empty array
    return []
  }
} 