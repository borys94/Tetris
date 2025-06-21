import { cloneCanvas } from '../../helpers/canvas'
import { clearCanvas } from '../../helpers/canvas'
import { drawCanvas } from '../../helpers/canvas'
import { Effect } from './effect'

abstract class ShakeEffect extends Effect {
  protected duration = 200
  protected movedCanvas = document.createElement('canvas')

  enter(): void {}

  render(ctx: CanvasRenderingContext2D) {
    cloneCanvas(ctx.canvas, this.movedCanvas)
    clearCanvas(ctx.canvas)
    drawCanvas(ctx, this.movedCanvas, this.getLeft(), this.getTop())
  }

  protected getShakeFactor() {
    const progresses = [0, 5, 2, 4, 1]
    return progresses[Math.floor(this.progress * progresses.length)]
  }

  abstract getLeft(): number
  abstract getTop(): number
}

export class ShakeLeftEffect extends ShakeEffect {
  getLeft() {
    return this.getShakeFactor() * -1
  }

  getTop() {
    return 0
  }
}

export class ShakeRightEffect extends ShakeEffect {
  getLeft() {
    return this.getShakeFactor()
  }

  getTop() {
    return 0
  }
}
export class ShakeDownEffect extends ShakeEffect {
  getLeft() {
    return 0
  }

  getTop() {
    return this.getShakeFactor()
  }
}