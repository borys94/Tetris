import config from '../../config'
import shapes from './shapes'

export enum ShapeType {
  IShape = 'IShape',
  ZShape = 'ZShape',
  SShape = 'SShape',
  LShape = 'LShape',
  JShape = 'JShape',
  OShape = 'OShape',
  TShape = 'TShape',
}

export default class Shape {
  private rotationIndex: number = 0

  constructor(
    private type: ShapeType,
    private color: number
  ) {}

  static createRandomShape() {
    const enumValues = Object.keys(ShapeType)
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const color = Math.floor(Math.random() * config.bricks.length) + 1
    return new Shape(enumValues[randomIndex] as unknown as ShapeType, color)
  }

  rotate() {
    this.rotationIndex = this.getNextRotationIndex()
  }

  getPositions(rotationIndex: number = this.rotationIndex): number[][] {
    return shapes[this.type][rotationIndex].map((y) => y.map((x) => x && this.color))
  }

  getRotatedShape() {
    return this.getPositions(this.getNextRotationIndex())
  }

  getRotationsCount() {
    return shapes[this.type].length
  }

  private getNextRotationIndex() {
    return (this.rotationIndex + 1) % shapes[this.type].length
  }
}
