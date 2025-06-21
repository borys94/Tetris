import config from '../../config'
import type Game from '..'
import { Effect } from './effect'

export class AddPointsEffect extends Effect {
  protected duration = 1500

  constructor(
    game: Game,
    private points: number
  ) {
    super(game)
  }

  enter(): void {}

  render(ctx: CanvasRenderingContext2D) {
    this.renderBackgroundPoints(ctx)
    // this.renderForegroundPoints(ctx)
  }

  private renderBackgroundPoints(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = 'center'
    ctx.font = `${50 * 2 * this.progress + 50}px Game`
    ctx.fillStyle = '#44bec7'
    ctx.globalAlpha = 1 - this.progress
    ctx.fillText(`+${this.points}`, config.board.width / 2, 200)
    ctx.globalAlpha = 1
  }

  // private renderForegroundPoints(ctx: CanvasRenderingContext2D) {
  //   ctx.textAlign = 'center'
  //   ctx.fillStyle = '#44bec7'
  //   ctx.font = `${Math.min(50 * this.progress * 4, 50 * 2)}px Game`
  //   ctx.globalAlpha = Math.min(2 - this.progress * 2, 1)
  //   console.log(ctx.font)
  //   ctx.fillText(`+${this.points}`, config.board.width / 2, 200)
  //   ctx.globalAlpha = 1
  // }
}
