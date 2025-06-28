import Board from './board/board'
import Level from './level'
import Scoring from './score'
import { Effect } from '../effects/effect'

class GameCore {
  private board: Board
  private level: Level
  private scoring: Scoring
  private effects: Effect[] = []

  constructor() {
    this.board = new Board()
    this.level = new Level()
    this.scoring = new Scoring(this.level)
  }

  getBoard() {
    return this.board
  }

  getLevel() {
    return this.level
  }

  getScoring() {
    return this.scoring
  }

  /**
   * Add an effect to the game
   */
  addEffect(effect: Effect) {
    this.effects.push(effect)
    effect.enter()
  }

  /**
   * Update all effects
   */
  updateEffects(deltaTime: number) {
    this.effects = this.effects.filter(effect => {
      effect.update(deltaTime)
      return !effect.isFinished()
    })
  }

  /**
   * Render all effects
   */
  renderEffects(ctx: CanvasRenderingContext2D) {
    this.effects.forEach(effect => effect.render(ctx))
  }

  reset() {
    this.board = new Board()
    this.level.reset()
    this.scoring.reset()
    this.effects = []
  }
}

export default GameCore
