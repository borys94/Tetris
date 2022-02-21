import Shape from "../Shape";
import Board from "../Board";
import { ShapeType } from "../../types";
import copy from "../../helpers/copy";

function nEmptyRows(n) {
  return new Array(n).fill(0).map((row) => new Array(10).fill(0));
}

function shiftRow(row, n) {
  let times = row.length - ((row.length + n) % row.length);
  while (times--) {
    row = [...row.slice(1), row[0]];
  }
  return row;
}

function shiftArray(array, n) {
  return array.map((row) => shiftRow(row, n));
}

function repeat(func, times) {
  func();
  times && --times && repeat(func, times);
}

const shapeOnEmptyBoard = [
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  ...nEmptyRows(14),
  [0, 0, 0, -1, -1, -1, -1, 0, 0, 0],
];

const shapeOnEmptyBoardNextStep = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  ...nEmptyRows(13),
  [0, 0, 0, -1, -1, -1, -1, 0, 0, 0],
];

const shapeOnEmptyBoardNextStep2 = [
  ...nEmptyRows(2),
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  ...nEmptyRows(12),
  [0, 0, 0, -1, -1, -1, -1, 0, 0, 0],
];

const shapeOnEmptyBoardBeforeLastStep = [
  ...nEmptyRows(14),
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, -1, -1, -1, -1, 0, 0, 0],
];

const shapeOnEmptyBoardLastStep = [
  ...nEmptyRows(15),
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
];

const shapeOnEmptyBoardNextShape = [
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  ...nEmptyRows(13),
  [0, 0, 0, -1, -1, -1, -1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

test("Text nextStep on Board", () => {
  jest.spyOn(Shape, "createRandomShape").mockImplementation(() => {
    return new Shape(ShapeType.IShape, 1);
  });

  // Initial position:
  // [0,0,0,1,1,1,1,0,0,0]
  // [0,0,0,0,0,0,0,0,0,0]
  // --------BOARD--------
  // [0,0,0,0,0,0,0,0,0,0]
  // ...
  // [0,0,0,0,0,0,0,0,0,0]

  const board = new Board();

  board.nextStep();
  board.nextStep();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoard);
  board.nextStep();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardNextStep);
  board.nextStep();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardNextStep2);
  repeat(() => board.nextStep(), 12);
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardBeforeLastStep);
  board.nextStep();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardLastStep);

  board.nextStep(); // shape is added to the board and new shape is created

  board.nextStep();
  board.nextStep();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardNextShape);
});

test("Text moving down on Board", () => {
  jest.spyOn(Shape, "createRandomShape").mockImplementation(() => {
    return new Shape(ShapeType.IShape, 1);
  });

  // Initial position:
  // [0,0,0,1,1,1,1,0,0,0]
  // [0,0,0,0,0,0,0,0,0,0]
  // --------BOARD--------
  // [0,0,0,0,0,0,0,0,0,0]
  // ...
  // [0,0,0,0,0,0,0,0,0,0]

  const board = new Board();

  board.moveDown();
  board.moveDown();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoard);
  board.moveDown();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardNextStep);
  board.moveDown();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardNextStep2);
  repeat(() => board.moveDown(), 12);
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardBeforeLastStep);
  board.moveDown();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardLastStep);

  // at this moment shape cannot move down because does not have empty space
  board.moveDown();
  board.moveDown();
  board.moveDown();
  expect(board.getShapeOnEmptyBoard()).toEqual(shapeOnEmptyBoardLastStep);
});

test("Text moving right Board", () => {
  jest.spyOn(Shape, "createRandomShape").mockImplementation(() => {
    return new Shape(ShapeType.IShape, 1);
  });

  // Initial position:
  // [0,0,0,1,1,1,1,0,0,0]
  // [0,0,0,0,0,0,0,0,0,0]
  // --------BOARD--------
  // [0,0,0,0,0,0,0,0,0,0]
  // ...
  // [0,0,0,0,0,0,0,0,0,0]

  const board = new Board();

  board.moveDown();
  board.moveDown();
  board.moveRight();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, 1)
  );
  board.moveRight();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, 2)
  );
  board.moveRight();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, 3)
  );

  // at this moment shape cannot move right and nothing happens
  board.moveRight();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, 3)
  );
  board.moveRight();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, 3)
  );
});

test("Text moving left Board", () => {
  jest.spyOn(Shape, "createRandomShape").mockImplementation(() => {
    return new Shape(ShapeType.IShape, 1);
  });

  // Initial position:
  // [0,0,0,1,1,1,1,0,0,0]
  // [0,0,0,0,0,0,0,0,0,0]
  // --------BOARD--------
  // [0,0,0,0,0,0,0,0,0,0]
  // ...
  // [0,0,0,0,0,0,0,0,0,0]

  const board = new Board();

  board.moveDown();
  board.moveDown();
  board.moveLeft();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, -1)
  );
  board.moveLeft();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, -2)
  );
  board.moveLeft();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, -3)
  );

  // at this moment shape cannot move left and nothing happens
  board.moveLeft();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, -3)
  );
  board.moveLeft();
  expect(board.getShapeOnEmptyBoard()).toEqual(
    shiftArray(shapeOnEmptyBoard, -3)
  );
});

test("Text updateShape event", () => {
  jest.spyOn(Shape, "createRandomShape").mockImplementation(() => {
    return new Shape(ShapeType.IShape, 1);
  });
  const board = new Board();
  const updateShapeMock = jest.fn();
  board.on("updateShape", updateShapeMock);

  expect(updateShapeMock).toHaveBeenCalledTimes(0);

  repeat(() => board.nextStep(), 3);
  expect(updateShapeMock).toHaveBeenCalledTimes(3);
  board.moveDown();
  expect(updateShapeMock).toHaveBeenCalledTimes(4);
  repeat(() => board.moveLeft(), 3);
  expect(updateShapeMock).toHaveBeenCalledTimes(7);

  // no empty space on left, event should not be triggered
  board.moveLeft();
  expect(updateShapeMock).toHaveBeenCalledTimes(7);

  // but can rotate
  board.rotate();
  expect(updateShapeMock).toHaveBeenCalledTimes(8);
});

test("Text updateBoard event", () => {
  jest.spyOn(Shape, "createRandomShape").mockImplementation(() => {
    return new Shape(ShapeType.IShape, 1);
  });
  const board = new Board();
  const updateBoardMock = jest.fn();
  board.on("updateBoard", updateBoardMock);

  expect(updateBoardMock).toHaveBeenCalledTimes(0);

  repeat(() => board.nextStep(), 3);
  board.moveLeft();
  board.rotate();
  board.rotate();
  expect(updateBoardMock).toHaveBeenCalledTimes(0);

  repeat(() => board.nextStep(), 15);
  expect(updateBoardMock).toHaveBeenCalledTimes(1);
  repeat(() => board.nextStep(), 18);
  expect(updateBoardMock).toHaveBeenCalledTimes(2);
});
