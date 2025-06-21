import config from '../../../config'
import { drawBackground } from '../../../helpers/board'
import Game from '../..'
import { State } from '../State'

class InitState extends State {
  constructor(game: Game) {
    super(game)
  }

  enter() {
    console.log('InitState')
  }

  update() {}

  render(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx)
  }

  handleInput() {}
}

export default InitState
