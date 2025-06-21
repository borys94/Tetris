import type Game from '../..'
import type { InputType } from '../../../inputHandler'
import { State } from '../State'
import { drawBackground } from '../../../helpers/board'
import config from '../../../config'

export class PauseState extends State {
  private elapsed = 0
  private duration = 500

  constructor(protected game: Game) {
    super(game)
  }

  enter(): void {
    this.elapsed = 0
  }

  update(deltaTime: number) {
    this.elapsed += deltaTime
  }

  render(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx)

    ctx.textAlign = 'center'
    ctx.font = `50px Game`
    ctx.fillStyle = '#44bec7'
    ctx.fillText(`Paused`, config.board.width / 2, 200)
  }

  handleInput(inputs: InputType[]): void {
    if (this.elapsed < this.duration) {
      return
    }
    if (inputs.includes('Escape') || inputs.includes('KeyP')) {
      this.game.setBoardPanelState('playing')
    }
  }
}
