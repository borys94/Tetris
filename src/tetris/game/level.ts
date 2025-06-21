export default class Level {
  private reducedRows: number = 0

  constructor(private initialLevel: number = 1) {
  }

  addReducedRows(rows: number) {
    this.reducedRows += rows
  }

  getLevel() {
    return this.initialLevel + Math.floor(this.reducedRows / 10)
  }

  getInitialLevel() {
    return this.initialLevel
  }

  getReducedRows() {
    return this.reducedRows
  }
}
