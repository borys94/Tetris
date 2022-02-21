import Engine from "./Engine";

const SPEED_ARRAY_LENGTH = 20;
const SPEED = new Array(SPEED_ARRAY_LENGTH)
  .fill(0)
  .map((v, index) => 50 + 800 * (1 - index / 20));

export default class GameLoop {
  private engine: Engine;
  private timestamp: number = 0;
  public canGoToNextStep = false;

  constructor(engine: Engine) {
    this.engine = engine;
    this.timestamp = Date.now();
  }

  start() {
    const timestamp = Date.now();
    if ((timestamp - this.timestamp) / this.getSpeed() >= 1) {
      if (this.canGoToNextStep) {
        this.engine.nextStep();
      }
      this.timestamp = timestamp;
    }
    window.requestAnimationFrame(() => this.start());
  }

  private getSpeed() {
    if (this.engine.isHardDropActive()) {
      return 10;
    } else if (this.engine.isSoftDropActive()) {
      return 30;
    }
    return SPEED[Math.min(this.engine.getLevel(), SPEED_ARRAY_LENGTH - 1)];
  }
}
