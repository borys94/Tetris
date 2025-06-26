import config from '../../config'
import imageLoader from '../../imageLoader'
import State from '../state'
import { PlayingStateType } from './playingStateMachine'

export default class ClearingLinesState extends State<PlayingStateType> {
  private clearTimer: number = 0
  private clearDelay: number = 300 // Time to show lines before clearing
  private linesToClear: number[] = []

  update(deltaTime: number): void {
    this.clearTimer += deltaTime

    if (this.clearTimer >= this.clearDelay) {
      // Clear the lines
      this.gameCore.getBoard().getPlayfield().clearLines()
      this.setTransition(PlayingStateType.FALLING)
    }
  }

  handleInput(): void {
    // No input handling during line clearing
  }

  render(ctx: CanvasRenderingContext2D) {
    const blocks = this.gameCore.getBoard().getPlayfield().getBlocks()
    const { brickSize } = config.board

    for (const [x, y, color] of blocks) {
      const brickImg = imageLoader.getBrickByColor(color)
      if (brickImg) {
        const reducingLinesBelow = this.linesToClear.filter((v) => v > y).length
        const height = brickSize - (this.clearTimer / this.clearDelay) * brickSize
        if (this.linesToClear.find((v) => v === y)) {
          ctx.globalAlpha = 1 - this.clearTimer / this.clearDelay
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

  enter(): void {
    super.enter()
    this.clearTimer = 0
    this.linesToClear = this.getLinesToClear()
  }

  private getLinesToClear() {
    const playfield = this.gameCore.getBoard().getPlayfield()
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
