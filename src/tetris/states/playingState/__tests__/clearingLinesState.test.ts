import { describe, it, expect, beforeEach, vi } from 'vitest'
import ClearingLinesState from '../clearingLinesState'
import { PlayingStateType } from '../playingStateMachine'

// Mock GameCore
vi.mock('../../../core/gameCore')

describe('ClearingLinesState', () => {
  let clearingLinesState: ClearingLinesState
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGameCore: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockBoard: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockScoring: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLevel: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPlayfield: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock objects
    mockPlayfield = {
      clearLines: vi.fn(),
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
      ]),
      getWidth: vi.fn(() => 10),
      getHeight: vi.fn(() => 20),
    }

    mockBoard = {
      detectTSpin: vi.fn(() => ({ isTSpin: false, isMiniTSpin: false, cornerCount: 0 })),
      getPlayfield: vi.fn(() => mockPlayfield),
      spawnTetromino: vi.fn(),
    }

    mockScoring = {
      addSingleLine: vi.fn(),
      addDoubleLine: vi.fn(),
      addTripleLine: vi.fn(),
      addTetris: vi.fn(),
      addTSpinSingle: vi.fn(),
      addTSpinDouble: vi.fn(),
      addTSpinTriple: vi.fn(),
      addMiniTSpinSingle: vi.fn(),
      addMiniTSpinDouble: vi.fn(),
      addComboPoints: vi.fn(),
      getCombo: vi.fn(() => 0),
      setCombo: vi.fn(),
      addEffect: vi.fn(),
    }

    mockLevel = {
      addClearedLines: vi.fn(),
    }

    mockGameCore = {
      getBoard: vi.fn(() => mockBoard),
      getScoring: vi.fn(() => mockScoring),
      getLevel: vi.fn(() => mockLevel),
      addEffect: vi.fn(),
    }

    // Create ClearingLinesState instance
    clearingLinesState = new ClearingLinesState(mockGameCore)
  })

  describe('update', () => {
    it('should transition to FALLING after clear delay', () => {
      // Act - simulate enough time for clearing
      clearingLinesState.update(300) // 300ms clear delay
      
      // Assert
      expect(clearingLinesState.getTransition()).toBe(PlayingStateType.FALLING)
    })

    it('should clear lines and update level after delay', () => {
      // Act
      clearingLinesState.update(300)
      
      // Assert
      expect(mockPlayfield.clearLines).toHaveBeenCalled()
      expect(mockLevel.addClearedLines).toHaveBeenCalledWith(10) // 10 full lines
      expect(mockBoard.spawnTetromino).toHaveBeenCalled()
    })

    it('should detect and award T-spin points', () => {
      // Arrange
      mockBoard.detectTSpin.mockReturnValue({ isTSpin: true, isMiniTSpin: false, cornerCount: 3 })
      
      // Act
      clearingLinesState.update(300)
      
      // Assert
      expect(mockScoring.addTSpinSingle).toHaveBeenCalled()
      expect(mockScoring.addComboPoints).toHaveBeenCalled()
    })

    it('should detect and award Mini T-spin points', () => {
      // Arrange
      mockBoard.detectTSpin.mockReturnValue({ isTSpin: false, isMiniTSpin: true, cornerCount: 2 })
      
      // Act
      clearingLinesState.update(300)
      
      // Assert
      expect(mockScoring.addMiniTSpinSingle).toHaveBeenCalled()
      expect(mockScoring.addComboPoints).toHaveBeenCalled()
    })

    it('should award regular line clear points when no T-spin', () => {
      // Arrange
      mockBoard.detectTSpin.mockReturnValue({ isTSpin: false, isMiniTSpin: false, cornerCount: 0 })
      
      // Act
      clearingLinesState.update(300)
      
      // Assert
      expect(mockScoring.addTetris).toHaveBeenCalled() // 10 lines = Tetris
      expect(mockScoring.addComboPoints).toHaveBeenCalled()
    })

    it('should update combo when lines are cleared', () => {
      // Arrange
      mockScoring.getCombo.mockReturnValue(2)
      
      // Act
      clearingLinesState.update(300)
      
      // Assert
      expect(mockScoring.setCombo).toHaveBeenCalledWith(3) // 2 + 1
    })
  })

  describe('handleInput', () => {
    it('should not handle any input during line clearing', () => {
      // Act & Assert - should not throw or do anything
      expect(() => clearingLinesState.handleInput(['ArrowLeft'])).not.toThrow()
    })
  })

  describe('render', () => {
    it('should render without throwing', () => {
      // Arrange
      const mockCtx = {
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        fillText: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        globalAlpha: 1,
      } as unknown as CanvasRenderingContext2D

      // Act & Assert - should not throw
      expect(() => clearingLinesState.render(mockCtx)).not.toThrow()
    })
  })

  describe('enter', () => {
    it('should initialize clear timer and lines to clear', () => {
      // Act
      clearingLinesState.enter()
      
      // Assert - should not throw and initialize properly
      expect(() => clearingLinesState.update(100)).not.toThrow()
    })
  })
}) 