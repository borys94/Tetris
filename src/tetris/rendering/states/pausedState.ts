import type { InputType } from "../../inputHandler"
import GameState from "./gameState"
import { GameStateType } from "../gameStateMachine"

export default class PausedState extends GameState<GameStateType> {
  private timer = 0
  private pauseDelay = 500
  private canUnpause = false

  update(deltaTime: number): void {
    this.timer += deltaTime
    if (this.timer >= this.pauseDelay) {
      this.canUnpause = true
    }
  }

  handleInput(inputs: InputType[]): void {
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
    ctx.fillText('Press P or ESC to resume', ctx.canvas.width / ratio / 2, ctx.canvas.height / ratio / 2 + 50)
  }

  enter(): void {
    super.enter()
    this.timer = 0
    this.canUnpause = false
    console.log('Entering Paused State')
  }

  exit(): void {
    console.log('Exiting Paused State')
  }
}