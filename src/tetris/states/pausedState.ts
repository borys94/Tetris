import type { InputType } from '../inputHandler'
import State from './state'
import { GameStateType } from './gameStateMachine'

export default class PausedState extends State<GameStateType> {
  private canUnpause = false

  update(): void {}

  handleInput(inputs: InputType[]): void {
    if (!inputs.includes('KeyP') && !inputs.includes('Escape')) {
      this.canUnpause = true
    }

    if (this.canUnpause && (inputs.includes('KeyP') || inputs.includes('Escape'))) {
      this.setTransition(GameStateType.PLAYING)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const ratio = window.devicePixelRatio
    // Render paused overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = 'white'
    ctx.font = '48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('PAUSED', ctx.canvas.width / ratio / 2, ctx.canvas.height / ratio / 2)

    ctx.font = '24px Arial'
    ctx.fillText(
      'Press P or ESC to resume',
      ctx.canvas.width / ratio / 2,
      ctx.canvas.height / ratio / 2 + 50
    )
  }

  enter(): void {
    super.enter()
    this.canUnpause = false
  }
}
