import Board from "./Board";
import Score from "./Score";
import Level from "./Level";
import Eventing from "./Eventing";

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
}

export default class Engine extends Eventing<Action> {
  private board: Board;
  private score: Score;
  private level: Level;
  private isHardDrop: boolean = false;
  private isSoftDrop: boolean = false;

  constructor() {
    super();
    this.board = new Board();
    this.level = new Level();
    this.score = new Score(this.level);
    this.initBoardEvents();
  }

  startNewGame() {
    this.board = new Board();
    this.level = new Level(this.level.getInitialLevel());
    this.score = new Score(this.level);
    this.initBoardEvents();

    this.onUpdateNextShapes();
    this.onLevelChange();
    this.trigger("updateBoard", this.board.getHeap());
    this.trigger("updateShape", []);
    this.trigger("score", 0);
  }

  moveLeft() {
    !this.board.moveLeft() && this.trigger("moveLeftFailed");
  }

  moveRight() {
    !this.board.moveRight() && this.trigger("moveRightFailed");
  }

  rotate() {
    this.board.rotate();
  }

  hardDrop() {
    let counter = 0;
    while (this.board.canMove(0, counter + 1)) {
      counter++;
    }
    this.isHardDrop = true;
    this.score.addPointForHardDrop(counter);
  }

  nextStep = () => {
    this.board.nextStep();
    if (this.isSoftDropActive()) {
      this.score.addPoint();
    }
  };

  getLevel() {
    return this.level.getLevel();
  }

  getBoardWithoutShape() {
    return this.board.getHeap();
  }

  getShapeOnBoard() {
    return this.board.getShapeOnEmptyBoard();
  }

  isHardDropActive() {
    return this.isHardDrop;
  }

  isSoftDropActive() {
    return this.isSoftDrop;
  }

  setSoftDrop(value: boolean) {
    this.isSoftDrop = value;
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

    this.score.on("score", this.onScore);
  }

  private onReducedRows = (reducedRows: number[]) => {
    if (reducedRows.length) {
      this.score.addPoints(reducedRows.length);
      this.level.addReducedRows(reducedRows.length);
      this.onLevelChange();
      this.trigger("reducedRows", reducedRows);
    }
  };

  private onMoveShapeDown = () => this.trigger("moveShapeDown");
  private onRotate = (success: boolean) => this.trigger("rotate", success);
  private onGameOver = () => this.trigger("gameOver");
  private onUpdateBoard = (board: number[][]) =>
    this.trigger("updateBoard", board);
  private onUpdateShape = (shapeOnBoard: number[][]) =>
    this.trigger("updateShape", shapeOnBoard);
  private onUpdateNextShapes = (nextShapes = this.board.getNextShapes()) =>
    this.trigger("nextShapes", nextShapes);

  private onScore = (score: number) => this.trigger("score", score);

  private onLevelChange() {
    this.trigger("level", this.level.getLevel());
  }
}
