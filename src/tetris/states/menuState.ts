import State from './state'
import { GameStateType } from './gameStateMachine'
import type { InputType } from '../inputHandler'

export default class MenuState extends State<GameStateType> {
  update(): void {
    // No updates in menu
  }

  handleInput(inputs: InputType[]): void {
    if (inputs.includes('Space')) {
      this.setTransition(GameStateType.PLAYING)
    }
    if (inputs.includes('Escape')) {
      // Exit game - handled by state machine
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const ratio = window.devicePixelRatio
    // Render menu
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = 'white'
    ctx.font = '64px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('TETRIS', ctx.canvas.width / ratio / 2, ctx.canvas.height / ratio / 2 - 100)

    ctx.font = '24px Arial'
    ctx.fillText(
      'Press SPACE to start',
      ctx.canvas.width / ratio / 2,
      ctx.canvas.height / ratio / 2
    )
    ctx.fillText(
      'Press ESC to exit',
      ctx.canvas.width / ratio / 2,
      ctx.canvas.height / ratio / 2 + 40
    )
  }
}
