import config from '../config'
import GameCore from '../core/gameCore'
import { setHighDpiCanvas } from '../helpers/canvas'
import InputHandler from '../inputHandler'
import { GameStateMachine } from './gameStateMachine'

export class GameEngine {
  private canvas: HTMLCanvasElement
  private gameCore: GameCore
  private stateMachine: GameStateMachine
  private animationId: number | null = null
  private lastTime: number = 0
  private inputHandler: InputHandler = new InputHandler()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    setHighDpiCanvas(canvas, config.board.width + config.rightPanel.width, config.board.height)
    this.gameCore = new GameCore()
    this.stateMachine = new GameStateMachine(this.gameCore)
  }

  start(): void {
    this.lastTime = performance.now()
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

    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime

    this.stateMachine.update(deltaTime)
    this.stateMachine.render(this.canvas.getContext('2d')!)
    this.stateMachine.handleInput(this.inputHandler.getActiveKeys())
  }

  getGameCore(): GameCore {
    return this.gameCore
  }

  getStateMachine(): GameStateMachine {
    return this.stateMachine
  }
}
