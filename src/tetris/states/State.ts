import type GameCore from '../core/gameCore'
import type { InputType } from '../inputHandler'

export default abstract class State<StateType extends string> {
  private transition: StateType | null = null
  protected gameCore: GameCore

  constructor(gameCore: GameCore) {
    this.gameCore = gameCore
  }

  abstract update(deltaTime: number): void
  abstract handleInput(inputs: InputType[]): void
  abstract render(ctx: CanvasRenderingContext2D): void

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseMove(x: number, y: number): void {
    // Default implementation does nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseClick(x: number, y: number): void {
    // Default implementation does nothing
  }

  enter() {
    this.transition = null
  }

  exit() {
    // Default implementation does nothing
  }

  getTransition(): StateType | null {
    return this.transition
  }

  protected setTransition(transition: StateType | null) {
    this.transition = transition
  }
}
