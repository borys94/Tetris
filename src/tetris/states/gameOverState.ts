import type { InputType } from '../inputHandler'
import State from './state'
import { GameStateType } from './gameStateMachine'

export default class GameOverState extends State<GameStateType> {
  update() {
    // No updates when game over
  }

  handleInput(inputs: InputType[]) {
    if (inputs.includes('Space')) {
      // Restart game - handled by state machine
    }
    if (inputs.includes('Escape')) {
      // Return to menu - handled by state machine
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const ratio = window.devicePixelRatio
    // Render game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = 'red'
    ctx.font = '48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', ctx.canvas.width / ratio / 2, ctx.canvas.height / ratio / 2 - 50)

    ctx.fillStyle = 'white'
    ctx.font = '24px Arial'
    ctx.fillText(
      `Final Score: ${this.gameCore.getScoring().getScore()}`,
      ctx.canvas.width / ratio / 2,
      ctx.canvas.height / ratio / 2
    )
    ctx.fillText(
      'Press SPACE to restart',
      ctx.canvas.width / ratio / 2,
      ctx.canvas.height / ratio / 2 + 50
    )
    ctx.fillText(
      'Press ESC for menu',
      ctx.canvas.width / ratio / 2,
      ctx.canvas.height / ratio / 2 + 80
    )
  }
}
