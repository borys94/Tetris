import Engine from "./Engine";
import { GameState } from "../types";

export default class KeyboardController {
  private engine: Engine;
  private arrowDown: boolean = false;

  constructor(engine: Engine) {
    this.engine = engine;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 40) {
      this.stopGoingDown();
    }
  };

  onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.keyCode === 37) {
      this.engine.moveLeft();
    } else if (event.keyCode === 39) {
      this.engine.moveRight();
    } else if (event.keyCode === 38) {
      this.engine.rotate();
    } else if (event.keyCode === 40) {
      this.startGoingDown();
    } else if (event.keyCode === 80) {
      if (this.engine.getState() === GameState.Started) {
        this.engine.pause();
      } else if (this.engine.getState() === GameState.Pause) {
        this.engine.unPause();
      }
    } else if (event.keyCode === 32) {
      this.engine.hardDrop();
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
