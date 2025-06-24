import type { PlayingState } from '.'
import config from '../../../../config'
import { drawPlayfieldBackground } from '../../../../helpers/renderer'
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
      this.game.board.getPlayfield().clearLines()
      this.parentState.setSubstate('blockDrop')
    }

    this.elapsed += deltaTime
  }

  render(ctx: CanvasRenderingContext2D) {
    const blocks = this.game.board.getPlayfield().getBlocks()
    const { brickSize } = config.board

    drawPlayfieldBackground(ctx)
    for (const [x, y, color] of blocks) {
      const brickImg = ImageLoader.getBrickByColor(color)
      if (brickImg) {
        const reducingLinesBelow = this.linesToReduce.filter((v) => v > y).length
        const height = brickSize - (this.elapsed / this.duration) * brickSize
        if (this.linesToReduce.find((v) => v === y)) {
          ctx.globalAlpha = 1 - this.elapsed / this.duration
          ctx.drawImage(
            brickImg,
            x * brickSize + config.board.margin,
            y * brickSize + config.board.margin + (brickSize - height) * (reducingLinesBelow + 1),
            brickSize,
            height
          )
          ctx.globalAlpha = 1
        } else {
          ctx.drawImage(
            brickImg,
            x * brickSize + config.board.margin,
            y * brickSize + config.board.margin + reducingLinesBelow * (brickSize - height),
            brickSize,
            brickSize
          )
        }
      }
    }
  }

  handleInput() {}

  private getLinesToReduce() {
    const playfield = this.game.board.getPlayfield()
    const blocks = playfield.getBlocks()
    const width = playfield.getWidth()
    const height = playfield.getHeight()
    const linesToReduce: number[] = []

    for (let y = 0; y < height; y++) {
      if (blocks.filter(([, by]) => by === y).length === width) {
        linesToReduce.push(y)
      }
    }

    return linesToReduce
  }
}
