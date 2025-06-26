import Board from './board/board'
import Level from './level'
import Scoring from './score'

class GameCore {
  private board: Board
  private level: Level
  private scoring: Scoring

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
}

export default GameCore
