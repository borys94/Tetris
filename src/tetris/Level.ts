export default class Level {
  private reducedRows: number = 0;
  private initialLevel: number;

  constructor(level: number = 0) {
    this.initialLevel = level;
  }

  addReducedRows(rows: number) {
    this.reducedRows += rows;
  }

  getLevel() {
    return this.initialLevel + Math.floor(this.reducedRows / 10);
  }

  getInitialLevel() {
    return this.initialLevel;
  }

  getReducedRows() {
    return this.reducedRows;
  }
}
