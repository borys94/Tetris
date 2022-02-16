const SPEED = [1000, 900, 830, 750, 700];

export default class Level {
  private reducedRows: number = 0;

  addReducedRows(rows: number) {
    this.reducedRows += rows;
  }

  getLevel() {
    return Math.floor(this.reducedRows / 10);
  }

  getReducedRows() {
    return this.reducedRows;
  }

  getSpeed() {
    return SPEED[this.getLevel()];
  }
}
