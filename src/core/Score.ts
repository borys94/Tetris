const PointsForReducedRows = [15, 30, 60, 120];

export default class Score {
  score: number = 0;

  addPoints(reducedRows: number) {
    this.score += PointsForReducedRows[reducedRows];
  }

  getPoints() {
    return this.score;
  }
}
