import Shape from "../Shape";
import { ShapeType } from "../../types";

const IShapeArray = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const IShapeRotatedArray = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
];

test("Text IShape", () => {
  jest.spyOn(Shape, "createRandomShape").mockImplementation(() => {
    return new Shape(ShapeType.IShape, 1);
  });
  const IShape = Shape.createRandomShape();
  expect(IShape.getPositions()).toEqual(IShapeArray);
  expect(IShape.getRotatedShape()).toEqual(IShapeRotatedArray);

  IShape.rotate();
  expect(IShape.getPositions()).toEqual(IShapeRotatedArray);
  expect(IShape.getRotatedShape()).toEqual(IShapeArray);
});
