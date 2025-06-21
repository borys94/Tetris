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

    // this.game.canvas.addEventListener('click', (e) => {
    //   this.handleClick(e.offsetX, e.offsetY)
    // })

    // this.game.canvas.addEventListener('mousemove', (e) => {
    //   this.handleMouseMove(e.offsetX, e.offsetY)
    // })

    // this.game.canvas.addEventListener('mouseleave', () => {
    //   this.handleMouseLeave()
    // })
  }

  abstract render(): HTMLCanvasElement
  abstract update(deltaTime: number): void

  // TODO: fix this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleClick(_x: number, _y: number) {
    // Override in subclasses to handle click events
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseMove(_x: number, _y: number) {
    // Override in subclasses to handle mouse move events
  }

  handleMouseLeave() {
    // Override in subclasses to handle mouse leave events
  }
}

export default Panel
