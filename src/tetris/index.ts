import Game from './game'
import InputHandler from './inputHandler'

class Tetris {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private timestamp: number
  private game: Game
  private inputHandler: InputHandler

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.ctx.imageSmoothingEnabled = true

    this.inputHandler = new InputHandler()
    this.timestamp = Date.now()

    this.game = new Game(canvas)

    this.gameLoop = this.gameLoop.bind(this)
    requestAnimationFrame(this.gameLoop)
  }

  private gameLoop(timestamp: number) {
    const deltaTime = timestamp - this.timestamp
    this.timestamp = timestamp

    this.game.update(deltaTime)
    this.game.render(this.ctx)
    this.game.handleInput(this.inputHandler.getActiveKeys())

    requestAnimationFrame(this.gameLoop)
  }
}

export default Tetris
