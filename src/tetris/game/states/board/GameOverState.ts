import type Game from '../..'
import type { InputType } from '../../../inputHandler'
import { State } from '../State'

export class GameOverState extends State {
  constructor(protected game: Game) {
    super(game)
  }

  enter(): void {
    // this.tetris.setState('running')
  }

  update(deltaTime: number) {}

  render(ctx: CanvasRenderingContext2D) {}

  handleInput(inputs: InputType[]): void {
    // if (!inputs.includes('ArrowLeft')) {
    //   this.setState('playing')
    // }
  }
}
