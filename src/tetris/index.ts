import config from './config'
import GameCore from './core/gameCore'
import InputHandler from './inputHandler'
import { GameStateMachine } from './states/gameStateMachine'
import { setHighDpiCanvas } from './helpers/canvas'

class Tetris {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private timestamp: number = 0
  private animationId: number | null = null

  private gameCore: GameCore
  private stateMachine: GameStateMachine
  private inputHandler: InputHandler

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.ctx.imageSmoothingEnabled = true
    setHighDpiCanvas(canvas, config.board.width + config.rightPanel.width, config.board.height)

    this.inputHandler = new InputHandler()
    this.gameCore = new GameCore()
    this.stateMachine = new GameStateMachine(this.gameCore)
  }

  start(): void {
    this.timestamp = performance.now()
    this.gameLoop()
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  private gameLoop(currentTime: number = performance.now()): void {
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time))

    const deltaTime = currentTime - this.timestamp
    this.timestamp = currentTime

    this.stateMachine.update(deltaTime)
    this.stateMachine.render(this.canvas.getContext('2d')!)
    this.stateMachine.handleInput(this.inputHandler.getActiveKeys())
  }
}

export default Tetris
