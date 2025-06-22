import { createCanvas } from '../../helpers/canvas'
// import type { InputType } from "../../inputHandler"
import type Game from '..'

abstract class Panel {
  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D

  constructor(
    protected game: Game,
    width: number,
    height: number
  ) {
    const { canvas, ctx } = createCanvas(width, height)
    this.canvas = canvas
    this.ctx = ctx
  }

  abstract render(): HTMLCanvasElement
  abstract update(deltaTime: number): void
}

export default Panel

export interface ClickablePanel {
  handleClick(x: number, y: number): void
  handleMouseMove(x: number, y: number): void
}
