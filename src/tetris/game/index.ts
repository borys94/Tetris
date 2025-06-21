import config from '../config'
import { drawCanvas } from '../helpers/canvas'
import type { InputType } from '../inputHandler'
import Board from './board/board'
import Level from './level'
import BoardPanel, { type TetrisStateType } from './panels/boardPanel'
import RightPanel from './panels/rightPanel'
import Score from './score'

class Game {
  level = new Level()
  score = new Score(this.level)
  board = new Board()
  gameTime = 0

  private rightPanel = new RightPanel(this)
  private boardPanel = new BoardPanel(this)

  public update(deltaTime: number) {
    this.boardPanel.update(deltaTime)
    this.rightPanel.update()
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
}

export default Game
