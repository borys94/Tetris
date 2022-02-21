import Engine from "./Engine";
import Eventing from "./Eventing";
import GameLoop from "./GameLoop";
import KeyboardController from "./KeyboardController";

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
  gameOver: undefined;
}

export default class Tetris extends Eventing<Actions> {
  private engine: Engine;
  private gameLoop: GameLoop;
  private keyboardController: KeyboardController;
  private state: GameState = GameState.NotReady;

  constructor() {
    super();
    this.engine = new Engine();
    this.gameLoop = new GameLoop(this.engine);
    this.keyboardController = new KeyboardController();
    this.addListeners();
    this.gameLoop.start();
  }

  getBoardWithoutShape() {
    return this.engine.getBoardWithoutShape();
  }

  getShapeOnBoard() {
    return this.engine.getShapeOnBoard();
  }

  startNewGame() {
    this.engine.startNewGame();
    this.setState(GameState.Started);
    this.gameLoop.canGoToNextStep = true;
  }

  unPause() {
    this.gameLoop.canGoToNextStep = true;
    this.setState(GameState.Started);
  }

  pause() {
    this.gameLoop.canGoToNextStep = false;
    this.setState(GameState.Pause);
  }

  setState(state: GameState) {
    if (this.state !== state) {
      this.state = state;
      this.trigger("state", state);
    }
  }

  getState() {
    return this.state;
  }

  private moveLeft = () => {
    if (this.state === GameState.Started) {
      this.engine.moveLeft();
    }
  };

  private moveRight = () => {
    if (this.state === GameState.Started) {
      this.engine.moveRight();
    }
  };

  private rotate = () => {
    if (this.state === GameState.Started) {
      this.engine.rotate();
    }
  };

  private hardDrop = () => {
    if (this.state === GameState.Started) {
      this.engine.hardDrop();
    }
  };

  private startGoingDown = () => {
    if (this.state === GameState.Started) {
      this.engine.setSoftDrop(true);
    }
  };

  private stopGoingDown = () => {
    if (this.state === GameState.Started) {
      this.engine.setSoftDrop(false);
    }
  };

  private playPause = () => {
    if (this.state === GameState.Started) {
      this.pause();
    } else if (this.state === GameState.Pause) {
      this.unPause();
    }
  };

  private onGameOver = () => {
    this.setState(GameState.Finished);
    this.trigger("gameOver");
  };

  private addListeners() {
    this.keyboardController.on("moveLeft", this.moveLeft);
    this.keyboardController.on("moveRight", this.moveRight);
    this.keyboardController.on("rotate", this.rotate);
    this.keyboardController.on("hardDrop", this.hardDrop);
    this.keyboardController.on("playPause", this.playPause);
    this.keyboardController.on("startGoingDown", this.startGoingDown);
    this.keyboardController.on("stopGoingDown", this.stopGoingDown);

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
    this.engine.on("gameOver", this.onGameOver);

    this.engine.on("nextShapes", (nextShapes: number[][][]) =>
      this.trigger("nextShapes", nextShapes)
    );

    // this.engine.on("state", (state: GameState) => this.trigger("state", state));
  }
}
