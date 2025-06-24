import config from '../../../config'
import { drawPlayfieldBackground } from '../../../helpers/renderer'
import Game from '../..'
import { StateWithButtons } from '../State'
import Button from '../../components/button'

class InitState extends StateWithButtons {
  constructor(game: Game) {
    super(game)

    const newGameButton = new Button(
      'Start',
      'primary',
      config.board.width / 2 - 100,
      config.board.height / 2 - 25,
      200,
      50
    )
    this.addButton(newGameButton)

    newGameButton.onClick(() => {
      this.game.reset()
      this.game.setBoardPanelState('resumingGame')
    })
  }

  enter() {}

  update(deltaTime: number) {
    super.update(deltaTime)
  }

  handleInput() {}

  render(ctx: CanvasRenderingContext2D) {
    drawPlayfieldBackground(ctx)
    super.renderButtons(ctx)
  }
}

export default InitState
