import GameCore from '../core/gameCore'
import type { InputType } from '../inputHandler'
import type GameState from './states/gameState'

export default abstract class StateMachine<StateType extends string> {
  protected abstract currentState: GameState<StateType>
  protected abstract states: Map<StateType, GameState<StateType>>
  protected gameCore: GameCore

  constructor(gameCore: GameCore) {
    this.gameCore = gameCore
  }

  update(deltaTime: number): void {
    this.currentState.update(deltaTime)
    
    const nextStateType = this.currentState.getTransition()
    if (nextStateType) {
      this.changeState(nextStateType)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.currentState.render(ctx)
  }

  handleInput(inputs: InputType[]): void {
    this.currentState.handleInput(inputs)
  }

  protected changeState(newStateType: StateType): void {
    const newState = this.states.get(newStateType)
    if (!newState) {
      throw new Error(`State ${newStateType} not found`)
    }

    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }

  getCurrentStateType(): StateType {
    for (const [stateType, state] of this.states) {
      if (state === this.currentState) {
        return stateType
      }
    }
    throw new Error('Current state not found in states map')
  }

  // private isGameOver(): boolean {
  //   const board = this.gameCore.getBoard()
  //   const activeTetromino = board.getActiveTetromino()
  //   return board.getPlayfield().hasCollision(activeTetromino)
  // }

  // private restartGame(): void {
  //   // Reset game core - we'll need to implement a reset method or create new instances
  //   // For now, we'll just reset scoring and level
  //   this.gameCore.getScoring().reset()
  //   this.gameCore.getLevel().reset()
  // }

  getCurrentState(): GameState<StateType> {
    return this.currentState
  }
}
