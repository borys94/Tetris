import Level from './level'

const PointsForReducedRows = [40, 100, 300, 1200]

// TODO
// https://tetris.fandom.com/wiki/Scoring
export default class Score {
  score: number = 0

  constructor(private level: Level) {}

  addPointsForReducedRows(reducedRows: number) {
    this.addPoints(this.getPointsForReducedRows(reducedRows))
  }

  getPointsForReducedRows(reducedRows: number) {
    return PointsForReducedRows[reducedRows - 1] * (this.level.getLevel() + 1)
  }

  addPointForSoftDrop(rows: number) {
    this.addPoints(rows)
  }

  addPointForHardDrop(rows: number) {
    this.addPoints(rows * 2)
  }

  getPoints() {
    return this.score
  }

  addPoints(points: number) {
    this.score += points
  }

  reset() {
    this.score = 0
  }
}
