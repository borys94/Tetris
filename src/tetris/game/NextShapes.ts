import Shape from "./Shape";

const NEXT_SHAPES_COUNT = 4

export default class NextShapes {
  private nextShapes: Shape[] = []

  constructor() {
    this.nextShapes = this.initNextShapes()
  }

  private initNextShapes() {
    return new Array(NEXT_SHAPES_COUNT).fill(null).map(() => Shape.createRandomShape())
  }

  getNextShapes() {
    return this.nextShapes.map(shape => shape.getPositions())
  }

  shift() {
    const shape = this.nextShapes[0]
    // const [shape, ...newArray] = this.nextShapes
    // this.nextShapes = [...newArray, Shape.createRandomShape()]
    this.nextShapes.shift()
    this.nextShapes.push(Shape.createRandomShape())
    return shape
  }
}