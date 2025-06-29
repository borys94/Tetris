import { describe, it, expect, beforeEach } from 'vitest'
import FallingState from '../fallingState'
import { PlayingStateType } from '../playingStateMachine'
import {
  createAllMocks,
  resetAllMocks,
  createMockCanvasRenderingContext2D,
  createMockPlayingState,
  type MockBoard,
  type MockScoring,
  type MockPlayfield,
} from './mocks'
import type PlayingState from '../index'

describe('FallingState', () => {
  let fallingState: FallingState
  let mockBoard: MockBoard
  let mockScoring: MockScoring
  let mockPlayfield: MockPlayfield

  beforeEach(() => {
    // Reset mocks
    resetAllMocks()

    // Create all mocks
    const mocks = createAllMocks()
    mockBoard = mocks.board
    mockScoring = mocks.scoring
    mockPlayfield = mocks.playfield

    // Create FallingState instance
    fallingState = new FallingState(
      mocks.gameCore,
      createMockPlayingState() as unknown as PlayingState
    )
  })

  describe('update', () => {
    it('should move tetromino down when drop timer reaches interval', () => {
      // Arrange
      mockBoard.canActiveTetrominoMoveDown.mockReturnValue(false)

      // Act - simulate enough time for a drop
      fallingState.update(1000) // 1 second

      // Assert
      expect(mockBoard.moveDown).toHaveBeenCalled()
    })

    it('should transition to LOCKING state when tetromino collides after moving down', () => {
      // Arrange
      mockBoard.canActiveTetrominoMoveDown
        .mockReturnValueOnce(false) // First call - no collision
        .mockReturnValueOnce(true) // Second call - collision after move

      // Act
      fallingState.update(1000)

      // Assert
      expect(fallingState.getTransition()).toBe(PlayingStateType.LOCKING)
    })

    it('should add soft drop points when soft dropping', () => {
      // Arrange
      mockBoard.canActiveTetrominoMoveDown.mockReturnValue(false)

      // Act - enable soft drop and update
      fallingState.handleInput(['ArrowDown'])
      fallingState.update(100) // 100ms for soft drop

      // Assert
      expect(mockScoring.addSoftDropPoints).toHaveBeenCalledWith(1)
    })
  })

  describe('handleInput', () => {
    it('should handle left arrow input', () => {
      // Act
      fallingState.handleInput(['ArrowLeft'])

      // Assert
      expect(mockBoard.moveLeft).toHaveBeenCalled()
    })

    it('should handle right arrow input', () => {
      // Act
      fallingState.handleInput(['ArrowRight'])

      // Assert
      expect(mockBoard.moveRight).toHaveBeenCalled()
    })

    it('should handle up arrow input (rotate right)', () => {
      // Act
      fallingState.handleInput(['ArrowUp'])

      // Assert
      expect(mockBoard.rotateRight).toHaveBeenCalled()
    })

    it('should handle Z key input (rotate left)', () => {
      // Act
      fallingState.handleInput(['KeyZ'])

      // Assert
      expect(mockBoard.rotateLeft).toHaveBeenCalled()
    })

    it('should handle hold tetromino with C key', () => {
      // Act
      fallingState.handleInput(['KeyC'])

      // Assert
      expect(mockBoard.holdTetromino).toHaveBeenCalled()
    })

    it('should handle hard drop with space key', () => {
      // Arrange
      mockBoard.canActiveTetrominoMoveDown.mockReturnValue(false).mockReturnValue(true)
      mockPlayfield.hasLineToClear.mockReturnValue(false)

      // Act
      fallingState.handleInput(['Space'])

      // Assert
      expect(mockBoard.mergeActiveTetromino).toHaveBeenCalled()
      expect(mockScoring.addHardDropPoints).toHaveBeenCalled()
    })

    it('should transition to CLEARING_LINES when hard drop clears lines', () => {
      // Arrange
      mockBoard.canActiveTetrominoMoveDown.mockReturnValue(false).mockReturnValue(true)
      mockPlayfield.hasLineToClear.mockReturnValue(true)

      // Act
      fallingState.handleInput(['Space'])

      // Assert
      expect(fallingState.getTransition()).toBe(PlayingStateType.CLEARING_LINES)
    })

    it('should reset combo when hard drop does not clear lines', () => {
      // Arrange
      mockBoard.canActiveTetrominoMoveDown.mockReturnValue(false).mockReturnValue(true)
      mockPlayfield.hasLineToClear.mockReturnValue(false)

      // Act
      fallingState.handleInput(['Space'])

      // Assert
      expect(mockScoring.setCombo).toHaveBeenCalledWith(0)
    })
  })

  describe('render', () => {
    it.todo('should call render methods without throwing', () => {
      // Arrange
      const mockCtx = createMockCanvasRenderingContext2D()

      // Act & Assert - should not throw
      expect(() => fallingState.render(mockCtx)).not.toThrow()
    })
  })
})
