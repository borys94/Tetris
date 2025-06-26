import type Game from "../core/gameCore";
import type { InputType } from "../inputHandler";

export abstract class State {
  constructor(protected game: Game) {}

  abstract enter(): void
  abstract update(deltaTime: number): void
  /**
   * @description Render the state on sub canvas that is rendered later on the main canvas
   * @param ctx - The sub canvas state is rendered on
   */
  abstract render(ctx: CanvasRenderingContext2D): void
  abstract handleInput(inputs: InputType[]): void
}