import Engine from "./Engine";
import Eventing from "./Eventing";

import { GameParams, GameState } from "../types";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../constants";

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

  constructor({
    width = BOARD_WIDTH,
    height = BOARD_HEIGHT,
    level = 0,
  }: GameParams) {
    super();
    this.engine = new Engine({
      width,
      height,
      level,
    });

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
}
