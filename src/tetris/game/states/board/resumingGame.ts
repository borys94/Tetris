import config from '../../../config'
import { drawBackground } from '../../../helpers/board'
import { State } from '../State'

export class ResumingGameState extends State {
  private elapsed = 0
  private duration = 3000

  enter(): void {
    this.elapsed = 0
  }

  update(deltaTime: number): void {
    this.elapsed += deltaTime
    if (this.elapsed > this.duration) {
      this.game.setBoardPanelState('playing')
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawBackground(ctx)
    ctx.textAlign = 'center'
    ctx.font = `70px Game`
    ctx.fillStyle = '#44bec7'
    ctx.fillText(`${Math.ceil((this.duration - this.elapsed) / 1000)}`, config.board.width / 2, 200)
  }

  handleInput(): void {}
}
