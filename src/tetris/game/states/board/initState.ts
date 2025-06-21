import config from '../../../config'
import { drawBackground } from '../../../helpers/board'
import Game from '../..'
import { State } from '../State'
import Button from '../../components/button'

class InitState extends State {
  private newGameButton: Button

  constructor(game: Game) {
    super(game)

    this.newGameButton = new Button('Start', 'primary', config.board.width / 2 - 100, config.board.height / 2 - 25, 200, 50)
    // this.addButton(this.newGameButton)
  }

  enter() {}

  update(deltaTime: number) {
    this.newGameButton.update(deltaTime)
  }

  handleInput() {}

  render(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx)
    this.newGameButton.render(ctx)
  }

  handleClick(x: number, y: number) {
    if (this.newGameButton.inBounds(x, y)) {
      this.game.setBoardPanelState('playing')
    }
  }

  handleMouseMove(x: number, y: number): void {
    if (this.newGameButton.inBounds(x, y)) {
      this.newGameButton.hover()
    } else {
      this.newGameButton.unhover()
    }
  }
}

export default InitState
