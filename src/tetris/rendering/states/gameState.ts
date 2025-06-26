import type GameCore from "../../core/gameCore"
import type { InputType } from "../../inputHandler"

export default abstract class GameState<StateType extends string> {
  private transition: StateType | null = null
  protected gameCore: GameCore

  constructor(gameCore: GameCore) {
    this.gameCore = gameCore
  }

  abstract update(deltaTime: number): void
  abstract handleInput(inputs: InputType[]): void
  abstract render(ctx: CanvasRenderingContext2D): void
  abstract exit(): void

  enter() {
    this.transition = null
  }

  protected setTransition(transition: StateType | null) {
    this.transition = transition
  }

  getTransition(): StateType | null {
    return this.transition
  }
}