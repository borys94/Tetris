import config from '../config'
import type GameCore from '../core/gameCore'
import { Effect } from './effect'

export class AddPointsEffect extends Effect {
  protected duration = 1500

  constructor(
    game: GameCore,
    private points: number
  ) {
    super(game)
  }

  enter(): void {}

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = `${50 * 2 * this.progress + 50}px Game`
    ctx.fillStyle = '#44bec7'
    ctx.globalAlpha = 1 - this.progress
    ctx.fillText(`+${this.points}`, config.board.width / 2, 200)
    ctx.restore()
  }
}
