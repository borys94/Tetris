import config from '../config'
import type GameCore from '../core/gameCore'
import { clearCanvas, drawCanvas, cutCanvas } from '../helpers/canvas'
import { Effect } from './effect'

export class ShakeEffect extends Effect {
  protected duration = 200
  private sideFactor = 0
  private topFactor = 0

  constructor(gameCore: GameCore, direction: 'left' | 'right' | 'top' | 'bottom') {
    super(gameCore)
    if (direction === 'left') {
      this.sideFactor = -1
    } else if (direction === 'right') {
      this.sideFactor = 1
    } else if (direction === 'top') {
      this.topFactor = -1
    } else if (direction === 'bottom') {
      this.topFactor = 1
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const shakeFactor = this.getShakeFactor()
    const shakedCanvas = cutCanvas(ctx.canvas, 0, 0, config.board.width, config.board.height)
    clearCanvas(ctx.canvas, 0, 0, config.board.width, config.board.height)
    drawCanvas(ctx, shakedCanvas, this.sideFactor * shakeFactor, this.topFactor * shakeFactor)
  }

  protected getShakeFactor() {
    const progresses = [0, 5, 2, 4, 1]
    return progresses[Math.floor(this.progress * progresses.length)]
  }
}
