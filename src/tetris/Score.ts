import Level from "./Level";
import Eventing from "./Eventing";

const PointsForReducedRows = [40, 100, 300, 1200];

interface Actions {
  score: number;
}

export default class Score extends Eventing<Actions> {
  score: number = 0;
  level: Level;

  constructor(level: Level) {
    super();
    this.level = level;
  }

  addPoints(reducedRows: number) {
    this.addToPoints(
      PointsForReducedRows[reducedRows - 1] * (this.level.getLevel() + 1)
    );
  }

  addPoint() {
    this.addToPoints(1);
  }

  addPointForHardDrop(rows: number) {
    this.addToPoints(rows);
  }

  getPoints() {
    return this.score;
  }

  private addToPoints(points: number) {
    this.score += points;
    this.trigger("score", this.score);
  }
}
