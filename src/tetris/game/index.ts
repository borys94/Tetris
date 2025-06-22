import config from '../config'
import { drawCanvas, setHighDpiCanvas } from '../helpers/canvas'
import type { InputType } from '../inputHandler'
import Board from './board/board'
import Level from './level'
import BoardPanel, { type TetrisStateType } from './panels/boardPanel'
import RightPanel from './panels/rightPanel'
import Score from './score'

class Game {
  /**
   * @description The main canvas game is rendered on
   */
  canvas: HTMLCanvasElement

  level = new Level()
  score = new Score(this.level)
  board = new Board()
  gameTime = 0

  private rightPanel: RightPanel
  private boardPanel: BoardPanel

  constructor(canvas: HTMLCanvasElement) {
    setHighDpiCanvas(canvas, config.board.width + config.rightPanel.width, config.board.height)
    this.canvas = canvas
    this.boardPanel = new BoardPanel(this)
    this.rightPanel = new RightPanel(this)

    this.canvas.addEventListener('click', (e) => {
      this.boardPanel.handleClick(e.offsetX, e.offsetY)
      // TODO: save canvas offset
      this.rightPanel.handleClick(e.offsetX - config.board.width, e.offsetY)
    })

    this.canvas.addEventListener('mousemove', (e) => {
      this.boardPanel.handleMouseMove(e.offsetX, e.offsetY)
      this.rightPanel.handleMouseMove(e.offsetX - config.board.width, e.offsetY)
    })
  }

  public update(deltaTime: number) {
    this.boardPanel.update(deltaTime)
    this.rightPanel.update(deltaTime)
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const boardCanvas = this.boardPanel.render()
    const rightPanelCanvas = this.rightPanel.render()

    drawCanvas(ctx, boardCanvas, 0, 0)
    drawCanvas(ctx, rightPanelCanvas, config.board.width, 0)
  }

  public handleInput(input: InputType[]) {
    this.boardPanel.handleInput(input)
  }

  public setBoardPanelState(state: TetrisStateType) {
    this.boardPanel.setState(state)
  }

  public reset() {
    this.board = new Board()
    this.level = new Level()
    this.score = new Score(this.level)
    this.gameTime = 0
  }

  public isPlaying() {
    return this.boardPanel.isPlaying()
  }
}

export default Game
