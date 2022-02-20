import Board from "./Board";
import Score from "./Score";
import Level from "./Level";
import GameLoop from "./GameLoop";
import KeyboardController from "./KeyboardController";
import Eventing from "./Eventing";

import { GameState } from "../types";

interface Action {
  updateBoard: number[][];
  updateShape: number[][];
  gameOver: undefined;
  reducedRows: number[];
  moveShapeDown: undefined;
  rotate: boolean;
  moveLeftFailed: undefined;
  moveRightFailed: undefined;
  level: number;
  score: number;
  nextShapes: number[][][];
  state: GameState;
}

export default class Engine extends Eventing<Action> {
  private board: Board;
  private score: Score;
  private level: Level;
  private gameLoop: GameLoop;
  private keyboardController: KeyboardController;

  private state: GameState = GameState.NotReady;
  private isHardDrop: boolean = false;

  constructor() {
    super();
    this.board = new Board();
    this.initBoardEvents();
    this.level = new Level();
    this.score = new Score(this.level);
    this.gameLoop = new GameLoop(this);
    this.keyboardController = new KeyboardController(this);
    this.gameLoop.start();
  }

  startNewGame() {
    this.board = new Board();
    this.initBoardEvents();

    this.level = new Level(this.level.getInitialLevel());
    this.score = new Score(this.level);

    this.setState(GameState.Started);
    this.onUpdateNextShapes();
    this.onLevelChange();
    this.updateScore();
    this.trigger("updateBoard", this.board.getHeap());
    this.trigger("updateShape", []);
  }

  unPause() {
    if (this.state === GameState.Pause) {
      this.setState(GameState.Started);
    }
  }

  pause() {
    if (this.state === GameState.Started) {
      this.setState(GameState.Pause);
    }
  }

  moveLeft() {
    if (this.state === GameState.Started) {
      if (!this.board.moveLeft()) {
        this.trigger("moveLeftFailed");
      }
    }
  }

  moveRight() {
    if (this.state === GameState.Started) {
      if (!this.board.moveRight()) {
        this.trigger("moveRightFailed");
      }
    }
  }

  rotate() {
    if (this.state === GameState.Started) {
      this.board.rotate();
    }
  }

  hardDrop() {
    if (this.state === GameState.Started) {
      let counter = 0;
      while (this.board.canMove(0, counter + 1)) {
        counter++;
      }
      this.isHardDrop = true;
      this.score.addPointForHardDrop(counter);
      this.updateScore();
    }
  }

  onMoveShapeDown = () => {
    this.trigger("moveShapeDown");
  };

  onRotate = (success: boolean) => {
    this.trigger("rotate", success);
  };

  nextStep = () => {
    this.board.nextStep();
    if (this.isDropActive()) {
      this.addOnePoint();
    }
  };

  getState() {
    return this.state;
  }

  getLevel() {
    return this.level.getLevel();
  }

  getHeap() {
    return this.board.getHeap();
  }

  getBoardWithoutShape() {
    return this.getHeap();
  }

  getShapeOnBoard() {
    return this.board.getShapeOnEmptyBoard();
  }

  isDropActive() {
    return this.keyboardController.isDropActive();
  }

  isHardDropActive() {
    return this.isHardDrop;
  }

  private initBoardEvents() {
    this.board.on("updateBoard", this.onUpdateBoard);
    this.board.on("updateShape", this.onUpdateShape);
    this.board.on("reducedRows", this.onReducedRows);
    this.board.on("gameOver", this.onGameOver);
    this.board.on("moveShapeDown", this.onMoveShapeDown);
    this.board.on("rotate", this.onRotate);
    this.board.on("nextShapes", this.onUpdateNextShapes);
    this.board.on("shapeAdded", () => (this.isHardDrop = false));
  }

  private onGameOver = () => {
    this.setState(GameState.Finished);
    this.trigger("gameOver");
  };

  private addOnePoint() {
    this.score.addPoint();
    this.updateScore();
  }

  private onReducedRows = (reducedRows: number[]) => {
    if (reducedRows.length) {
      this.score.addPoints(reducedRows.length);
      this.level.addReducedRows(reducedRows.length);

      this.onLevelChange();
      this.updateScore();
      this.trigger("reducedRows", reducedRows);
    }
  };

  private onUpdateBoard = (board: number[][]) => {
    this.trigger("updateBoard", board);
  };

  private onUpdateShape = (shapeOnBoard: number[][]) => {
    this.trigger("updateShape", shapeOnBoard);
  };

  private updateScore() {
    this.trigger("score", this.score.getPoints());
  }

  private onUpdateNextShapes = (nextShapes = this.board.getNextShapes()) => {
    this.trigger("nextShapes", nextShapes);
  };

  private onLevelChange() {
    this.trigger("level", this.level.getLevel());
  }

  private setState(state: GameState) {
    this.state = state;
    this.trigger("state", state);
  }
}
