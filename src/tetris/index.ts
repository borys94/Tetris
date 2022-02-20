import Engine from "./Engine";
import Eventing from "./Eventing";

import { GameState } from "../types";

interface Actions {
  moveLeftFailed: undefined;
  moveRightFailed: undefined;
  reducedRows: number[];
  updateBoard: number[][];
  updateShape: number[][];
  level: number;
  score: number;
  nextShapes: number[][][];
  state: GameState;
  rotate: undefined;
}

export default class Tetris extends Eventing<Actions> {
  private engine: Engine;

  constructor() {
    super();
    this.engine = new Engine();
    this.addListeners();
  }

  getBoardWithoutShape() {
    return this.engine.getBoardWithoutShape();
  }

  getShapeOnBoard() {
    return this.engine.getShapeOnBoard();
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

  private addListeners() {
    this.engine.on("reducedRows", (reducedRows) =>
      this.trigger("reducedRows", reducedRows)
    );
    this.engine.on("level", (level) => this.trigger("level", level));
    this.engine.on("rotate", () => this.trigger("rotate"));
    this.engine.on("moveLeftFailed", () => this.trigger("moveLeftFailed"));
    this.engine.on("moveRightFailed", () => this.trigger("moveRightFailed"));
    this.engine.on("updateBoard", (board: number[][]) =>
      this.trigger("updateBoard", board)
    );
    this.engine.on("updateShape", (board: number[][]) =>
      this.trigger("updateShape", board)
    );
    this.engine.on("score", (score: number) => this.trigger("score", score));

    this.engine.on("nextShapes", (nextShapes: number[][][]) =>
      this.trigger("nextShapes", nextShapes)
    );

    this.engine.on("state", (state: GameState) => this.trigger("state", state));
  }
}
