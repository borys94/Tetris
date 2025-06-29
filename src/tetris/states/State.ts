import type Board from '../core/board/board'
import type GameCore from '../core/gameCore'
import type Level from '../core/level'
import type Scoring from '../core/score'
import type { InputType } from '../inputHandler'

export default abstract class State<StateType extends string> {
  private transition: StateType | null = null

  protected gameCore: GameCore
  protected board: Board
  protected scoring: Scoring
  protected level: Level

  constructor(gameCore: GameCore) {
    this.gameCore = gameCore
    this.board = gameCore.getBoard()
    this.scoring = gameCore.getScoring()
    this.level = gameCore.getLevel()
  }

  abstract update(deltaTime: number): void
  abstract handleInput(inputs: InputType[]): void
  abstract render(ctx: CanvasRenderingContext2D): void

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseMove(x: number, y: number): void {
    // Default implementation does nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseClick(x: number, y: number): void {
    // Default implementation does nothing
  }

  enter() {
    this.transition = null
  }

  exit() {
    // Default implementation does nothing
  }

  getTransition(): StateType | null {
    return this.transition
  }

  protected setTransition(transition: StateType | null) {
    this.transition = transition
  }
}
