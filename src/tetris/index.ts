import Engine from "./Engine";
import { GameParams } from "../types";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../constants";

export default class Tetris {
  private engine: Engine;

  constructor({
    width = BOARD_WIDTH,
    height = BOARD_HEIGHT,
    level = 0,
    onEvent,
  }: GameParams) {
    this.engine = new Engine({
      width,
      height,
      onEvent,
      level,
    });
  }

  startNewGame() {
    this.engine.startNewGame();
  }

  unPause() {
    this.engine.unPause();
  }

  pause() {
    this.engine.pause();
  }

  getState() {
    return this.engine.getState();
  }
}
