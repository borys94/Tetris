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

    this.inputHandler = new InputHandler(this.canvas)
    this.gameCore = new GameCore()
    this.stateMachine = new GameStateMachine(this.gameCore)

    this.setupMouseHandlers()
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

  private setupMouseHandlers(): void {
    this.inputHandler.onMouseMove((event) => {
      const canvasRect = this.canvas.getBoundingClientRect()
      const x = event.position.x - canvasRect.left
      const y = event.position.y - canvasRect.top
      this.stateMachine.handleMouseMove(x, y)
    })

    this.inputHandler.onMouseClick((event) => {
      const canvasRect = this.canvas.getBoundingClientRect()
      const x = event.position.x - canvasRect.left
      const y = event.position.y - canvasRect.top
      this.stateMachine.handleMouseClick(x, y)
    })
  }
}

export default Tetris
