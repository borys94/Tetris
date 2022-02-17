import Board, { BoardAction } from "./Board";
import Score from "./Score";
import Level from "./Level";
import GameLoop from "./GameLoop";
import KeyboardController from "./KeyboardController";

import { GameState, GameEvent, GameParams } from "../types";

export default class Engine {
  private board: Board;
  private score: Score;
  private level: Level;
  private gameLoop: GameLoop;
  private keyboardController: KeyboardController;

  private state: GameState = GameState.NotReady;
  private onEvent: (event: GameEvent) => void;

  constructor({ width, height, onEvent, level }: Required<GameParams>) {
    this.board = new Board(width, height, this.onBoardCallback);
    this.level = new Level(level);
    this.score = new Score(this.level);

    this.gameLoop = new GameLoop(this);
    this.keyboardController = new KeyboardController(this);

    this.onEvent = onEvent;
    this.setState(GameState.ReadyToStart);
    this.gameLoop.start();
    this.onUpdateBoard();
    (window as any).engine = this;
  }

  startNewGame() {
    this.board = new Board(
      this.board.getWidth(),
      this.board.getHeight(),
      this.onBoardCallback
    );
    this.level = new Level(this.level.getInitialLevel());
    this.score = new Score(this.level);

    this.setState(GameState.Started);
    this.onUpdateNextShapes();
    this.onLevelChange();
    this.updateScore();
    this.onReducedRowsChange();
  }

  unPause() {
    this.setState(GameState.Started);
  }

  pause() {
    this.setState(GameState.Pause);
  }

  moveLeft() {
    if (this.state === GameState.Started) {
      this.board.moveLeft();
    }
  }

  moveRight() {
    if (this.state === GameState.Started) {
      this.board.moveRight();
    }
  }

  rotate() {
    if (this.state === GameState.Started) {
      this.board.rotate();
    }
  }

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

  isDropActive() {
    return this.keyboardController.isDropActive();
  }

  private onBoardCallback = (boardAction: BoardAction, data: any) => {
    if (boardAction === BoardAction.UpdateBoard) {
      this.onUpdateBoard();
    } else if (boardAction === BoardAction.GameOver) {
      this.setState(GameState.Finished);
    } else if (boardAction === BoardAction.ReduceRows) {
      this.onReducedRows(data);
    }
  };

  private addOnePoint() {
    this.score.addPoint();
    this.updateScore();
  }

  private onReducedRows(reducedRows: number) {
    if (reducedRows) {
      this.score.addPoints(reducedRows);
      this.level.addReducedRows(reducedRows);

      this.onLevelChange();
      this.updateScore();
      this.onReducedRowsChange();
    }
  }

  private onUpdateBoard() {
    this.onEvent({ name: "UPDATE_BOARD", data: this.board.getHeap() });
  }

  private updateScore() {
    this.onEvent({ name: "ON_SCORE_CHANGE", data: this.score.getPoints() });
  }

  private onUpdateNextShapes() {
    this.onEvent({
      name: "ON_NEXT_SHAPES_CHANGE",
      data: this.board.getNextShapes(),
    });
  }

  private onLevelChange() {
    this.onEvent({ name: "ON_LEVEL_CHANGE", data: this.level.getLevel() });
  }

  private onReducedRowsChange() {
    this.onEvent({
      name: "ON_REDUCED_ROWS_CHANGE",
      data: this.level.getReducedRows(),
    });
  }

  private setState(state: GameState) {
    this.state = state;
    this.onEvent({ name: "ON_SET_GAME_STATE", data: state });
  }
}
