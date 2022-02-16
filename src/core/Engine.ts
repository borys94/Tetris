import Board from "./Board";
import Shape from "./Shape";
import ShapeOnBoard from "./ShapeOnBoard";
import Score from "./Score";
import Level from "./Level";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../constants";
import { GameState, GameEvent } from "../types";

const NEXT_SHAPES_COUNT = 4;

export default class Engine {
  private board: Board | null = null;
  private shape: Shape | null = null;
  private nextShapes: Shape[] | null = null;
  private shapeOnBoard: ShapeOnBoard | null = null;
  private score: Score;
  private level: Level;
  private state: GameState = GameState.NotReady;
  private timestamp: number = Date.now();

  private onEvent: (event: GameEvent) => void;

  constructor(
    width = BOARD_WIDTH,
    height = BOARD_HEIGHT,
    onEvent: (event: GameEvent) => void
  ) {
    this.board = new Board(width, height);
    this.level = new Level();
    this.score = new Score(this.level);

    this.onEvent = onEvent;
    this.setState(GameState.ReadyToStart);
    this.onUpdateBoard();
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

  // TODO
  startNewGame() {
    console.log("start new game");
    this.board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
    this.level = new Level();
    this.score = new Score(this.level);
    this.setState(GameState.Started);

    this.onUpdateBoard();
  }

  start() {
    if (!this.board) {
      return;
    }

    this.setState(GameState.Started);
    window.requestAnimationFrame(() => {
      this.run();
    });

    if (!this.shape) {
      this.shape = Shape.createRandomShape();
      this.nextShapes = new Array(NEXT_SHAPES_COUNT).fill(null).map((count) => {
        return Shape.createRandomShape();
      });
      this.shapeOnBoard = new ShapeOnBoard(this.shape, this.board);
      this.setState(GameState.Started);
    }
  }

  setState(state: GameState) {
    this.state = state;
    this.onEvent({ name: "ON_SET_GAME_STATE", data: state });
  }

  pause() {
    this.setState(GameState.Pause);
  }

  private nextStep = () => {
    if (
      this.shapeOnBoard === null ||
      this.board === null ||
      this.shape === null ||
      this.nextShapes === null
    ) {
      return;
    }
    const reducedRows = this.board.tryReduce();
    if (reducedRows) {
      this.score.addPoints(reducedRows);
      this.level.addReducedRows(reducedRows);
      this.onEvent({
        name: "ON_REDUCED_ROWS_CHANGE",
        data: this.level.getReducedRows(),
      });
    }

    if (this.shapeOnBoard.colisionInNextStep()) {
      this.board.addShape(
        this.shape,
        this.shapeOnBoard.getPositionX(),
        this.shapeOnBoard.getPositionY()
      );
      this.shape = this.nextShapes[0];
      this.nextShapes.shift();
      this.nextShapes.push(Shape.createRandomShape());
      this.shapeOnBoard = new ShapeOnBoard(this.shape, this.board);
      if (!this.shapeOnBoard.canMove(0, 1)) {
        this.setState(GameState.Finished);
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

  getNextShapes() {
    return this.nextShapes;
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
