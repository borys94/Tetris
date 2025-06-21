import type Game from '../..'
import type { InputType } from '../../../inputHandler'
import { State } from '../State'
import { drawBackground } from '../../../helpers/board'
import config from '../../../config'
import Button from '../../components/button'

export class PauseState extends State {
  private elapsed = 0
  private duration = 500
  private unpauseButton: Button

  constructor(protected game: Game) {
    super(game)

    this.unpauseButton = new Button(
      'Start',
      'primary',
      config.board.width / 2 - 100,
      config.board.height / 2 - 25,
      200,
      50
    )
  }

  enter(): void {
    this.elapsed = 0
  }

  update(deltaTime: number) {
    this.elapsed += deltaTime

    this.unpauseButton.update(deltaTime)
  }

  render(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx)

    ctx.textAlign = 'center'
    ctx.font = `50px Game`
    ctx.fillStyle = '#44bec7'
    ctx.fillText(`Paused`, config.board.width / 2, 200)

    this.unpauseButton.render(ctx)
  }

  handleInput(inputs: InputType[]): void {
    if (this.elapsed < this.duration) {
      return
    }
    if (inputs.includes('Escape') || inputs.includes('KeyP')) {
      this.game.setBoardPanelState('playing')
    }
  }

  handleClick(x: number, y: number) {
    if (this.unpauseButton.inBounds(x, y)) {
      this.game.setBoardPanelState('playing')
    }
  }

  handleMouseMove(x: number, y: number): void {
    if (this.unpauseButton.inBounds(x, y)) {
      this.unpauseButton.hover()
    } else {
      this.unpauseButton.unhover()
    }
  }
}
