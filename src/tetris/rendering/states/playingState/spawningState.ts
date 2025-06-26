import GameState from "../gameState"
import { PlayingStateType } from "./playingStateMachine"

export default class SpawningState extends GameState<PlayingStateType> {
  private spawnTimer: number = 0
  private spawnDelay: number = 100 // Short delay before spawning

  update(deltaTime: number): void {
    this.spawnTimer += deltaTime

    if (this.spawnTimer >= this.spawnDelay) {
      // Spawn new tetromino
      this.spawnNewTetromino()
    }
  }

  handleInput(): void {
    // No input handling during spawning
  }

  render(): void {
    // renderer.render()
  }

  enter(): void {
    // super.enter()
    console.log('Entering Spawning State')
    this.spawnTimer = 0
  }

  exit(): void {
    console.log('Exiting Spawning State')
  }

  shouldTransition(): PlayingStateType | null {
    if (this.spawnTimer >= this.spawnDelay) {
      // Check if game over (new tetromino collides immediately)
      const board = this.gameCore.getBoard()
      if (board.hasCollisionInNextStep()) {
        // Game over - this should be handled by the main state machine
        return null
      } else {
        return PlayingStateType.FALLING
      }
    }
    
    return null
  }

  private spawnNewTetromino(): void {
    // The board should handle spawning the next tetromino
    // This is typically done automatically when merging the previous one
    // But we can ensure it's ready here
    // const board = this.gameCore.getBoard()
    // The board should already have the next tetromino ready
    // We just need to make sure it's properly positioned
  }
} 