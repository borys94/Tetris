import Score from "./Score";

const LEVELS = [100, 200, 350, 550, 800, 1200];

const SPEED = [1000, 900, 830, 750, 700];

export default class Level {
  private level: number = 1;
  private score: Score;

  constructor(score: Score) {
    this.score = score;
    this.watch();
  }

  private watch() {
    window.requestAnimationFrame(() => {
      this.checkIfNewLevel();
      this.watch();
    });
  }

  private checkIfNewLevel() {
    const level =
      LEVELS.findIndex((points) => this.score.getPoints() < points) + 1;
    this.level = level;
  }

  getLevel() {
    return this.level;
  }

  getSpeed() {
    return SPEED[this.level];
  }
}
