import config from './config'
import Game from './game'
import { setHighDpiCanvas } from './helpers/canvas'
import InputHandler from './inputHandler'

class Tetris {
  private ctx: CanvasRenderingContext2D
  private timestamp: number = 0
  private game: Game
  private inputHandler = new InputHandler()

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.ctx.imageSmoothingEnabled = false

    setHighDpiCanvas(canvas, config.board.width + config.rightPanel.width, config.board.height)

    this.game = new Game(canvas)

    this.gameLoop = this.gameLoop.bind(this)
    this.gameLoop()
  }

  private gameLoop(timestamp: number = 0) {
    const deltaTime = timestamp - this.timestamp
    this.timestamp = timestamp

    this.game.update(deltaTime)
    this.game.render(this.ctx)
    this.game.handleInput(this.inputHandler.getActiveKeys())

    requestAnimationFrame(this.gameLoop)
  }
}

export default Tetris
