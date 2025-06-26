export default class Level {
  private clearedLines: number = 0

  constructor(private initialLevel: number = 1) {}

  addClearedLines(lines: number) {
    this.clearedLines += lines
  }

  getLevel() {
    return this.initialLevel + Math.floor(this.clearedLines / 10)
  }

  getClearedLines() {
    return this.clearedLines
  }

  reset() {
    this.clearedLines = 0
  }
}
