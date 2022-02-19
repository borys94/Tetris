import { ShapeType } from "../../types";
import { BRICK_COLORS } from "../../constants";
import shapes from "./shapes";

export default class Shape {
  type: ShapeType;
  rotationIndex: number = 0;
  color: number;

  private constructor(type: ShapeType, color: number) {
    this.type = type;
    this.color = color;
  }

  static createRandomShape() {
    const enumValues = Object.keys(ShapeType);
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const color = Math.floor(Math.random() * BRICK_COLORS.length) + 1;
    return new Shape(enumValues[randomIndex] as unknown as ShapeType, color);
  }

  rotate() {
    this.rotationIndex = this.getNextRotationIndex();
  }

  getPositions(rotationIndex: number = this.rotationIndex): number[][] {
    return shapes[this.type][rotationIndex].map((y) =>
      y.map((x) => x && this.color)
    );
  }

  getRotatedShape() {
    return this.getPositions(this.getNextRotationIndex());
  }

  getRotationsCount() {
    return shapes[this.type].length;
  }

  private getNextRotationIndex() {
    return (this.rotationIndex + 1) % shapes[this.type].length;
  }
}
