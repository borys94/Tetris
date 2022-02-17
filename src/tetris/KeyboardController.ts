import Engine from "./Engine";

export default class KeyboardController {
  private engine: Engine;
  private keyDown: boolean = false;
  private arrowDown: boolean = false;

  constructor(engine: Engine) {
    this.engine = engine;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyUp = (event: any) => {
    if (!this.keyDown) {
      return;
    }
    this.keyDown = false;
    if (event.keyCode === 40) {
      this.stopGoingDown();
    }
  };

  onKeyDown = (event: any) => {
    if (this.keyDown) {
      return;
    }
    this.keyDown = true;
    if (event.keyCode === 37) {
      this.engine.moveLeft();
    } else if (event.keyCode === 39) {
      this.engine.moveRight();
    } else if (event.keyCode === 38) {
      this.engine.rotate();
    } else if (event.keyCode === 40) {
      this.startGoingDown();
    }
  };

  isDropActive() {
    return this.arrowDown;
  }

  startGoingDown() {
    this.arrowDown = true;
  }

  stopGoingDown() {
    this.arrowDown = false;
  }
}
