import type Game from '../..'
import type { InputType } from '../../../inputHandler'
import { StateWithButtons } from '../State'
import { drawBackground } from '../../../helpers/board'
import config from '../../../config'
import Button from '../../components/button'

export class PauseState extends StateWithButtons {
  private elapsed = 0
  private duration = 500

  constructor(protected game: Game) {
    super(game)

    const unpauseButton = new Button(
      'Resume',
      'primary',
      config.board.width / 2 - 100,
      config.board.height / 2 - 25,
      200,
      50
    )

    const newGameButton = new Button(
      'New Game',
      'primary',
      config.board.width / 2 - 100,
      config.board.height / 2 - 100,
      200,
      50
    )

    this.addButton(unpauseButton)
    this.addButton(newGameButton)

    unpauseButton.onClick(() => {
      this.game.setBoardPanelState('resumingGame')
    })

    newGameButton.onClick(() => {
      this.game.reset()
      this.game.setBoardPanelState('resumingGame')
    })
  }

  enter(): void {
    this.elapsed = 0
  }

  update(deltaTime: number) {
    super.update(deltaTime)
    this.elapsed += deltaTime
  }

  render(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx)

    ctx.textAlign = 'center'
    ctx.font = `50px Game`
    ctx.fillStyle = '#44bec7'
    ctx.fillText(`Paused`, config.board.width / 2, 200)

    super.renderButtons(ctx)
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
