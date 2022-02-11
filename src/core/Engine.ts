import Board from "./Board";
import Shape from "./Shape";
import ShapeOnBoard from "./ShapeOnBoard";
import Score from "./Score";
import Level from "./Level";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../constants";
import { GameState, GameEvent } from "../types";

export default class Engine {
  private board: Board | null = null;
  private shape: Shape | null = null;
  private nextShape: Shape | null = null;
  private shapeOnBoard: ShapeOnBoard | null = null;
  private score: Score;
  private level: Level;
  private state: GameState = GameState.ReadyToStart;
  private timestamp: number = Date.now();

  private onEvent: (event: GameEvent) => void;

  constructor(
    width = BOARD_WIDTH,
    height = BOARD_HEIGHT,
    onEvent: (event: GameEvent) => void
  ) {
    this.board = new Board(width, height);
    this.score = new Score();
    this.level = new Level(this.score);

    this.onEvent = onEvent;
    this.onEvent({
      name: "UPDATE_BOARD",
      data: this.getHeap(),
    });
  }

  private run() {
    if (this.state === GameState.Started) {
      const timestamp = Date.now();
      if ((timestamp - this.timestamp) / this.level.getSpeed() >= 1) {
        this.nextStep();
        this.timestamp = timestamp;
      }
      window.requestAnimationFrame(() => this.run());
    }
  }

  start() {
    if (!this.board) {
      return;
    }

    this.state = GameState.Started;
    window.requestAnimationFrame(() => {
      this.run();
    });

    this.onEvent({ name: "ON_START" });

    if (!this.shape) {
      this.shape = Shape.createRandomShape();
      this.nextShape = Shape.createRandomShape();
      this.shapeOnBoard = new ShapeOnBoard(this.shape, this.board);
      this.state = GameState.Started;
    }
  }

  pause() {
    this.state = GameState.Pause;
    this.onEvent({ name: "ON_PAUSE" });
  }

  private nextStep = () => {
    if (
      this.shapeOnBoard === null ||
      this.board === null ||
      this.shape === null ||
      this.nextShape === null
    ) {
      return;
    }
    const reducedRows = this.board.tryReduce();
    if (reducedRows) {
      this.score.addPoints(reducedRows);
    }

    if (this.shapeOnBoard.colisionInNextStep()) {
      this.board.addShape(
        this.shape,
        this.shapeOnBoard.getPositionX(),
        this.shapeOnBoard.getPositionY()
      );
      this.shape = this.nextShape;
      this.nextShape = Shape.createRandomShape();
      this.shapeOnBoard = new ShapeOnBoard(this.shape, this.board);
      if (!this.shapeOnBoard.canMove(0, 1)) {
        this.state = GameState.Finished;
        this.onEvent({ name: "ON_FINISH" });
      }
    } else {
      this.shapeOnBoard.moveDown();
    }

    this.onUpdateBoard();
  };

  private getHeap() {
    if (this.shapeOnBoard) {
      return this.shapeOnBoard.getHeap();
    } else if (this.board) {
      return this.board.getHeap();
    }
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score.getPoints();
  }

  getLevel() {
    return this.level.getLevel();
  }

  getNextShape() {
    return this.nextShape;
  }

  moveLeft() {
    if (this.shapeOnBoard && this.state === GameState.Started) {
      this.shapeOnBoard.moveLeft();
      this.onUpdateBoard();
    }
  }

  moveRight() {
    if (this.shapeOnBoard && this.state === GameState.Started) {
      this.shapeOnBoard.moveRight();
      this.onUpdateBoard();
    }
  }

  goDown() {
    if (this.shapeOnBoard && this.state === GameState.Started) {
      this.shapeOnBoard.moveToBottom();
      this.onUpdateBoard();
    }
  }

  rotate() {
    if (this.shapeOnBoard && this.state === GameState.Started) {
      this.shapeOnBoard.rotate();
      this.onUpdateBoard();
    }
  }

  private onUpdateBoard() {
    const board = this.getHeap();
    if (!board) {
      return;
    }
    this.onEvent({ name: "UPDATE_BOARD", data: this.getHeap() });
  }
}
