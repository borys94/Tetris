import { describe, it, expect, beforeEach } from 'vitest'
import ClearingLinesState from '../clearingLinesState'
import { PlayingStateType } from '../playingStateMachine'
import { 
  createAllMocks, 
  resetAllMocks, 
  createMockCanvasRenderingContext2D,
  createMockPlayingState,
  type MockBoard,
  type MockScoring,
  type MockPlayfield,
  type MockLevel
} from './mocks'
import type PlayingState from '../index'

describe('ClearingLinesState', () => {
  let clearingLinesState: ClearingLinesState
  let mockBoard: MockBoard
  let mockScoring: MockScoring
  let mockPlayfield: MockPlayfield
  let mockLevel: MockLevel

  beforeEach(() => {
    // Reset mocks
    resetAllMocks()

    // Create all mocks
    const mocks = createAllMocks()
    mockBoard = mocks.board
    mockScoring = mocks.scoring
    mockPlayfield = mocks.playfield
    mockLevel = mocks.level

    // Create ClearingLinesState instance
    clearingLinesState = new ClearingLinesState(mocks.gameCore, createMockPlayingState() as unknown as PlayingState)
  })

  describe('update', () => {
    beforeEach(() => {
      // initialize clear timer and lines to clear
      clearingLinesState.enter()
    })

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
      expect(() => clearingLinesState.handleInput()).not.toThrow()
    })
  })

  describe('render', () => {
    it('should render without throwing', () => {
      // Arrange
      const mockCtx = createMockCanvasRenderingContext2D()

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