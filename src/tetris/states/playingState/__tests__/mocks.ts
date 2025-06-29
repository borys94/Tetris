import { vi } from 'vitest'
import type GameCore from '../../../core/gameCore'
import type Playfield from '../../../core/board/playfield'
import type { MockFromClass } from './mockTypes'
import type Board from '../../../core/board/board'
import type Scoring from '../../../core/score'
import type Level from '../../../core/level'
import type { TetrominoBlock } from '../../../core/board/tetrominos/shapes'

// Mock GameCore
vi.mock('../../../core/gameCore')

export type MockPlayfield = MockFromClass<Playfield>

export type MockBoard = MockFromClass<Board>

export type MockScoring = MockFromClass<Scoring>

export type MockLevel = MockFromClass<Level>

export type MockGameCore = MockFromClass<GameCore>

export type MockPlayingState = {
  addEffect: ReturnType<typeof vi.fn>
}

export interface MockContext {
  drawImage: ReturnType<typeof vi.fn>
  fillRect: ReturnType<typeof vi.fn>
  fillText: ReturnType<typeof vi.fn>
  save: ReturnType<typeof vi.fn>
  restore: ReturnType<typeof vi.fn>
  globalAlpha: number
}

export function createMockPlayfield(): MockPlayfield {
  return {
    getWidth: vi.fn(() => 10),
    getHeight: vi.fn(() => 20),
    getBlocks: vi.fn(() => [
      [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1], [4, 0, 1], [5, 0, 1], [6, 0, 1], [7, 0, 1], [8, 0, 1], [9, 0, 1], // Full line
      [0, 1, 1], [1, 1, 1], [2, 1, 1], [3, 1, 1], [4, 1, 1], [5, 1, 1], [6, 1, 1], [7, 1, 1], [8, 1, 1], [9, 1, 1], // Full line
      [0, 2, 1], [1, 2, 1], [2, 2, 1], [3, 2, 1], [4, 2, 1], [5, 2, 1], [6, 2, 1], [7, 2, 1], [8, 2, 1], [9, 2, 1], // Full line
      [0, 3, 1], [1, 3, 1], [2, 3, 1], [3, 3, 1], [4, 3, 1], [5, 3, 1], [6, 3, 1], [7, 3, 1], [8, 3, 1], [9, 3, 1], // Full line
      [0, 4, 1], [1, 4, 1], [2, 4, 1], [3, 4, 1], [4, 4, 1], [5, 4, 1], [6, 4, 1], [7, 4, 1], [8, 4, 1], [9, 4, 1], // Full line
      [0, 5, 1], [1, 5, 1], [2, 5, 1], [3, 5, 1], [4, 5, 1], [5, 5, 1], [6, 5, 1], [7, 5, 1], [8, 5, 1], [9, 5, 1], // Full line
      [0, 6, 1], [1, 6, 1], [2, 6, 1], [3, 6, 1], [4, 6, 1], [5, 6, 1], [6, 6, 1], [7, 6, 1], [8, 6, 1], [9, 6, 1], // Full line
      [0, 7, 1], [1, 7, 1], [2, 7, 1], [3, 7, 1], [4, 7, 1], [5, 7, 1], [6, 7, 1], [7, 7, 1], [8, 7, 1], [9, 7, 1], // Full line
      [0, 8, 1], [1, 8, 1], [2, 8, 1], [3, 8, 1], [4, 8, 1], [5, 8, 1], [6, 8, 1], [7, 8, 1], [8, 8, 1], [9, 8, 1], // Full line
      [0, 9, 1], [1, 9, 1], [2, 9, 1], [3, 9, 1], [4, 9, 1], [5, 9, 1], [6, 9, 1], [7, 9, 1], [8, 9, 1], [9, 9, 1], // Full line
    ] as TetrominoBlock[]),
    hasCollision: vi.fn(() => false),
    merge: vi.fn(),
    hasLineToClear: vi.fn(() => false),
    clearLines: vi.fn(),
  }
}

export function createMockBoard(playfield?: MockPlayfield): MockBoard {
  const mockPlayfield = playfield || createMockPlayfield()
  
  return {
    moveDown: vi.fn(),
    moveLeft: vi.fn(),
    moveRight: vi.fn(),
    rotateRight: vi.fn(),
    rotateLeft: vi.fn(),
    mergeActiveTetromino: vi.fn(),
    spawnTetromino: vi.fn(),
    canActiveTetrominoMoveDown: vi.fn(() => false),
    detectTSpin: vi.fn(() => ({ isTSpin: false, isMiniTSpin: false, cornerCount: 0 })),
    getPlayfield: vi.fn(() => mockPlayfield),
    getTetrominoQueue: vi.fn(() => []),
    getActiveTetromino: vi.fn(),
    holdTetromino: vi.fn(),
    getHeldTetromino: vi.fn(),
    canHoldTetromino: vi.fn(() => true),
  }
}

export function createMockScoring(): MockScoring {
  return {
    addClearedLines: vi.fn(),
    getClearedLinesPoints: vi.fn(),
    addSingleLine: vi.fn(),
    addDoubleLine: vi.fn(),
    addTripleLine: vi.fn(),
    addTetris: vi.fn(),
    addTSpinSingle: vi.fn(),
    addTSpinDouble: vi.fn(),
    addTSpinTriple: vi.fn(),
    addMiniTSpinSingle: vi.fn(),
    addMiniTSpinDouble: vi.fn(),
    addSoftDropPoints: vi.fn(),
    addHardDropPoints: vi.fn(),
    addComboPoints: vi.fn(),
    setCombo: vi.fn(),
    getScore: vi.fn(() => 0),
    addPoints: vi.fn(),
    reset: vi.fn(),
    getCombo: vi.fn(() => 0),
    isBackToBack: vi.fn(() => false),
  }
}

export function createMockLevel(): MockLevel {
  return {
    addClearedLines: vi.fn(),
    getLevel: vi.fn(() => 1),
    getClearedLines: vi.fn(() => 0),
    reset: vi.fn(),
  }
}

export function createMockGameCore(
  board?: MockBoard,
  scoring?: MockScoring,
  level?: MockLevel
): MockGameCore {
  const mockBoard = board || createMockBoard()
  const mockScoring = scoring || createMockScoring()
  const mockLevel = level || createMockLevel()

  return {
    getBoard: vi.fn(() => mockBoard),
    getScoring: vi.fn(() => mockScoring),
    getLevel: vi.fn(() => mockLevel),
    reset: vi.fn(),
  }
}

export function createMockContext(): MockContext {
  return {
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    globalAlpha: 1,
  }
}

export function createMockCanvasRenderingContext2D(): CanvasRenderingContext2D {
  return createMockContext() as unknown as CanvasRenderingContext2D
}

// Helper function to reset all mocks
export function resetAllMocks(): void {
  vi.clearAllMocks()
}

// Helper function to create all mocks at once
export function createAllMocks() {
  const playfield = createMockPlayfield()
  const board = createMockBoard(playfield)
  const scoring = createMockScoring()
  const level = createMockLevel()
  const gameCore = createMockGameCore(board, scoring, level)

  return {
    playfield,
    board,
    scoring,
    level,
    gameCore: gameCore as unknown as GameCore,
  }
}

export function createMockPlayingState(): MockPlayingState {
  return {
    addEffect: vi.fn(),
  }
} 