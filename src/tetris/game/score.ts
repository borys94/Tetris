import Level from './level'

const PointsForReducedRows = [40, 100, 300, 1200]

export default class Score {
  score: number = 0

  constructor(private level: Level) {}

  addPointsForReducedRows(reducedRows: number) {
    this.addPoints(this.getPointsForReducedRows(reducedRows))
  }

  getPointsForReducedRows(reducedRows: number) {
    return PointsForReducedRows[reducedRows - 1] * (this.level.getLevel() + 1)
  }

  addPointForDrop(rows: number, ratio: number) {
    this.addPoints(rows * ratio)
  }

  getPoints() {
    return this.score
  }

  addPoints(points: number) {
    this.score += points
  }
}
