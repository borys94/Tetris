import Level from "./Level";

const PointsForReducedRows = [40, 100, 300, 1200];

export default class Score {
  score: number = 0;
  level: Level;

  constructor(level: Level) {
    this.level = level;
  }

  addPoints(reducedRows: number) {
    this.score +=
      PointsForReducedRows[reducedRows - 1] * (this.level.getLevel() + 1);
  }

  addPoint() {
    this.score++;
  }

  addPointForHardDrop(rows: number) {
    this.score += rows;
  }

  getPoints() {
    return this.score;
  }
}
