import Level from './level'

// Tetris Guideline Scoring System
// https://tetris.fandom.com/wiki/Scoring
export default class Scoring {
  private points: number = 0
  private level: Level
  private backToBack: boolean = false
  private combo: number = 0

  constructor(level: Level) {
    this.level = level
  }

  // Basic line clears

  // TODO: refactor this
  addClearedLines(lines: LineClearCount) {
    this.addPoints(BASE_LINE_CLEAR_POINTS[lines])
  }

  getClearedLinesPoints(lines: LineClearCount) {
    return BASE_LINE_CLEAR_POINTS[lines]
  }

  addSingleLine() {
    this.addLineClearPoints(LineClearType.SINGLE)
  }

  addDoubleLine() {
    this.addLineClearPoints(LineClearType.DOUBLE)
  }

  addTripleLine() {
    this.addLineClearPoints(LineClearType.TRIPLE)
  }

  addTetris() {
    this.addLineClearPoints(LineClearType.TETRIS)
  }

  // T-Spin line clears
  addTSpinSingle() {
    this.addLineClearPoints(LineClearType.T_SPIN_SINGLE)
  }

  addTSpinDouble() {
    this.addLineClearPoints(LineClearType.T_SPIN_DOUBLE)
  }

  addTSpinTriple() {
    this.addLineClearPoints(LineClearType.T_SPIN_TRIPLE)
  }

  // Mini T-Spin line clears
  addMiniTSpinSingle() {
    this.addLineClearPoints(LineClearType.MINI_T_SPIN_SINGLE)
  }

  addMiniTSpinDouble() {
    this.addLineClearPoints(LineClearType.MINI_T_SPIN_DOUBLE)
  }

  // Soft drop points (1 point per cell)
  addSoftDropPoints(cells: number) {
    this.addPoints(cells)
  }

  // Hard drop points (2 points per cell)
  addHardDropPoints(cells: number) {
    this.addPoints(cells * 2)
  }

  // Combo points (50 points per combo level)
  addComboPoints() {
    if (this.combo > 0) {
      this.addPoints(this.combo * 50 * (this.level.getLevel() + 1))
    }
  }

  // Set combo count (called when lines are cleared)
  setCombo(combo: number) {
    this.combo = combo
  }

  // Get current score
  getScore(): number {
    return this.points
  }

  // Add points directly
  addPoints(points: number) {
    this.points += points
  }

  // Reset score
  reset() {
    this.points = 0
    this.backToBack = false
    this.combo = 0
  }

  // Get current combo
  getCombo(): number {
    return this.combo
  }

  // Get back-to-back status
  isBackToBack(): boolean {
    return this.backToBack
  }

  // Private method to handle line clear points with back-to-back logic
  private addLineClearPoints(lineClearType: LineClearType) {
    const basePoints = this.getBasePointsForLineClear(lineClearType)
    const levelMultiplier = this.level.getLevel() + 1
    let totalPoints = basePoints * levelMultiplier

    // Apply back-to-back bonus
    if (this.isBackToBackEligible(lineClearType) && this.backToBack) {
      totalPoints = Math.floor(totalPoints * 1.5)
    }

    // Update back-to-back status
    this.backToBack = this.isBackToBackEligible(lineClearType)

    this.addPoints(totalPoints)
  }

  // Check if line clear type is eligible for back-to-back bonus
  private isBackToBackEligible(lineClearType: LineClearType): boolean {
    return [
      LineClearType.TETRIS,
      LineClearType.T_SPIN_SINGLE,
      LineClearType.T_SPIN_DOUBLE,
      LineClearType.T_SPIN_TRIPLE,
      LineClearType.MINI_T_SPIN_DOUBLE,
    ].includes(lineClearType)
  }

  // Get base points for different line clear types
  private getBasePointsForLineClear(lineClearType: LineClearType): number {
    return LINE_CLEAR_POINTS[lineClearType]
  }
}

// Enum for different types of line clears
export enum LineClearType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  TETRIS = 'TETRIS',
  MINI_T_SPIN_SINGLE = 'MINI_T_SPIN_SINGLE',
  MINI_T_SPIN_DOUBLE = 'MINI_T_SPIN_DOUBLE',
  T_SPIN_SINGLE = 'T_SPIN_SINGLE',
  T_SPIN_DOUBLE = 'T_SPIN_DOUBLE',
  T_SPIN_TRIPLE = 'T_SPIN_TRIPLE',
}

const LINE_CLEAR_POINTS: Record<LineClearType, number> = {
  [LineClearType.SINGLE]: 100,
  [LineClearType.DOUBLE]: 300,
  [LineClearType.TRIPLE]: 500,
  [LineClearType.TETRIS]: 800,
  [LineClearType.MINI_T_SPIN_SINGLE]: 200,
  [LineClearType.MINI_T_SPIN_DOUBLE]: 400,
  [LineClearType.T_SPIN_SINGLE]: 800,
  [LineClearType.T_SPIN_DOUBLE]: 1200,
  [LineClearType.T_SPIN_TRIPLE]: 1600,
}

type LineClearCount = 1 | 2 | 3 | 4

const BASE_LINE_CLEAR_POINTS: Record<LineClearCount, number> = {
  1: LINE_CLEAR_POINTS[LineClearType.SINGLE],
  2: LINE_CLEAR_POINTS[LineClearType.DOUBLE],
  3: LINE_CLEAR_POINTS[LineClearType.TRIPLE],
  4: LINE_CLEAR_POINTS[LineClearType.TETRIS],
}

// TODO: Implement T-Spin detection logic
// This would require integration with the rotation system and playfield analysis
// to detect when T-pieces are rotated into positions that create T-spins
