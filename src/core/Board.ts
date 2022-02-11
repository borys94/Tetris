import Shape from "./Shape";
import copy from "../helpers/copy";

export default class Board {
  private heap: number[][];

  constructor(private width: number, private height: number) {
    this.heap = new Array(this.height).fill(new Array(this.width).fill(0));
  }

  getHeap(): number[][] {
    return copy(this.heap);
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  addShape(shape: Shape, destinationX: number, destinationY: number) {
    const positions = shape.getPositions();
    let heap = copy(this.heap);
    for (let y in positions) {
      for (let x in positions[+y]) {
        if (positions[y][x] && +y + destinationY >= 0) {
          heap[+y + destinationY][+x + destinationX] = positions[y][x];
        }
      }
    }
    this.heap = heap;
  }

  tryReduce() {
    let reducedRows = 0;
    for (let y in this.heap) {
      let allInRow = true;
      for (let x in this.heap[+y]) {
        if (this.heap[y][x] === 0) {
          allInRow = false;
        }
      }
      if (allInRow) {
        this.reduceLine(+y);
        reducedRows++;
      }
    }
    return reducedRows;
  }

  private reduceLine(line: number) {
    let heap = copy(this.heap);
    heap.splice(line, 1);
    heap = [new Array(this.width).fill(0), ...heap];
    this.heap = heap;
  }
}
