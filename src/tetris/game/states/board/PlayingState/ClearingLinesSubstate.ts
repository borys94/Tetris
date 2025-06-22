import type { PlayingState } from '.'
import config from '../../../../config'
import { drawBackground } from '../../../../helpers/board'
import ImageLoader from '../../../../imageLoader'
import type Game from '../../..'
import { AddPointsEffect } from '../../../effects/addPointsEffect'
import { ShakeDownEffect } from '../../../effects/shakeEffect'
import { ChildState } from '../../State'

export class ClearingLinesSubstate extends ChildState {
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
      this.parentState.setSubstate('blockDrop')
    }

    this.elapsed += deltaTime
  }

  render(ctx: CanvasRenderingContext2D) {
    const heap = this.game.board.getHeap()
    drawBackground(ctx)

    for (let x = 0; x < heap.length; x++) {
      for (let y = 0; y < heap[0].length; y++) {
        const brickImg = ImageLoader.getBrickByColor(heap[x][y])
        if (heap[x][y] && brickImg) {
          const reducingLinesBelow = this.linesToReduce.filter((v) => v > x).length
          const height =
            config.board.brickSize - (this.elapsed / this.duration) * config.board.brickSize
          if (this.linesToReduce.find((v) => v === x)) {
            ctx.globalAlpha = 1 - this.elapsed / this.duration
            ctx.drawImage(
              brickImg,
              y * config.board.brickSize + config.board.margin,
              x * config.board.brickSize +
                config.board.margin +
                (config.board.brickSize - height) * (reducingLinesBelow + 1),
              config.board.brickSize,
              height
            )
            ctx.globalAlpha = 1
          } else {
            ctx.drawImage(
              brickImg,
              y * config.board.brickSize + config.board.margin,
              x * config.board.brickSize +
                config.board.margin +
                reducingLinesBelow * (config.board.brickSize - height),
              config.board.brickSize,
              config.board.brickSize
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
