import type { PlayingState } from '.'
import config from '../../../../config'
import { drawBackground } from '../../../../helpers/board'
import ImageLoader from '../../../../imageLoader'
import type Game from '../../../Game'
import { AddPointsEffect } from '../../../effects/addPointsEffect'
import { ShakeDownEffect } from '../../../effects/shakeEffect'
import { PlayingSubstate } from './PlayingSubstate'

export class ClearingLinesSubstate extends PlayingSubstate {
  protected disableParentUpdate = true
  private elapsed = 0
  private duration = 150
  private linesToReduce: number[] = []

  constructor(
    game: Game,
    protected parentState: PlayingState
  ) {
    super(game, parentState)
  }

  enter(): void {
    this.elapsed = 0
    this.linesToReduce = this.getLinesToReduce()
    this.parentState.addEffect(
      new AddPointsEffect(
        this.game,
        this.game.score.getPointsForReducedRows(this.linesToReduce.length)
      )
    )
    this.parentState.addEffect(new ShakeDownEffect(this.game))
    this.game.score.addPointsForReducedRows(this.linesToReduce.length)
    this.game.level.addReducedRows(this.linesToReduce.length)
  }

  update(deltaTime: number) {
    if (this.elapsed >= this.duration) {
      this.game.board.tryReduce()
      this.parentState.setSubstate(null)
    }

    this.elapsed += deltaTime
  }

  render(ctx: CanvasRenderingContext2D) {
    const heap = this.game.board.getHeap()
    drawBackground(ctx)

    // shake animation
    const progresses = [0, 5, 2, 4, 1]
    const progress = this.elapsed / this.duration
    const marginTop = progresses[Math.floor(progress * progresses.length)]
    ctx.canvas.style.marginTop = `${marginTop}px`

    for (let x = 0; x < heap.length; x++) {
      for (let y = 0; y < heap[0].length; y++) {
        const brickImg = ImageLoader.getBrickByColor(heap[x][y])
        if (heap[x][y] && brickImg) {
          const reducingLinesBelow = this.linesToReduce.filter((v) => v > x).length
          const height = 40 - (this.elapsed / this.duration) * 40
          if (this.linesToReduce.find((v) => v === x)) {
            ctx.globalAlpha = 1 - this.elapsed / this.duration
            ctx.drawImage(
              brickImg,
              y * 40 + config.board.margin,
              x * 40 + config.board.margin + (40 - height) * (reducingLinesBelow + 1),
              40,
              height
            )
            ctx.globalAlpha = 1
          } else {
            ctx.drawImage(
              brickImg,
              y * 40 + config.board.margin,
              x * 40 + config.board.margin + reducingLinesBelow * (40 - height),
              40,
              40
            )
          }
        }
      }
    }
  }

  handleInput() {}

  private getLinesToReduce() {
    return this.game.board
      .getHeap()
      .map((row, index) => (row.every((v) => v !== 0) ? index : -1))
      .filter((v) => v !== -1)
  }
}
