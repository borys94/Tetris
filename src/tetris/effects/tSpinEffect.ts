import config from '../config'
import type GameCore from '../core/gameCore'
import { Effect } from './effect'

export class TSpinEffect extends Effect {
  protected duration = 2000

  constructor(
    game: GameCore,
    private tSpinType: 'T-Spin' | 'Mini T-Spin',
    private linesCleared: number
  ) {
    super(game)
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = `${40 * 2 * this.progress + 40}px Game`
    ctx.fillStyle = '#ff6b6b'
    ctx.globalAlpha = 1 - this.progress
    ctx.fillText(`${this.tSpinType}`, config.board.width / 2, 150)

    if (this.linesCleared > 0) {
      ctx.font = `${30 * 2 * this.progress + 30}px Game`
      ctx.fillStyle = '#4ecdc4'
      ctx.fillText(`${this.linesCleared} Lines!`, config.board.width / 2, 200)
    }

    ctx.restore()
  }
}
