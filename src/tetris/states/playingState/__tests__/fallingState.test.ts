import { describe, it, expect, beforeEach, vi } from 'vitest'
import FallingState from '../fallingState'
import { PlayingStateType } from '../playingStateMachine'

// Mock GameCore
vi.mock('../../../core/gameCore')

describe('FallingState', () => {
  let fallingState: FallingState
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGameCore: {
    getBoard: () => any
    getScoring: () => any
    getLevel: () => any
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockBoard: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockScoring: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLevel: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock objects
    mockBoard = {
      moveDown: vi.fn(),
      moveLeft: vi.fn(),
      moveRight: vi.fn(),
      rotateRight: vi.fn(),
      rotateLeft: vi.fn(),
      hasCollisionInNextStep: vi.fn(),
      mergeActiveTetromino: vi.fn(),
      getPlayfield: vi.fn(() => ({
        hasLineToClear: vi.fn(),
      })),
    }

    mockScoring = {
      addSoftDropPoints: vi.fn(),
      addHardDropPoints: vi.fn(),
      setCombo: vi.fn(),
    }

    mockLevel = {
      getLevel: vi.fn(() => 1),
    }

    mockGameCore = {
      getBoard: vi.fn(() => mockBoard),
      getScoring: vi.fn(() => mockScoring),
      getLevel: vi.fn(() => mockLevel),
    }

    // Create FallingState instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fallingState = new FallingState(mockGameCore as any)
  })

  describe('update', () => {
    it('should move tetromino down when drop timer reaches interval', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(false)
      
      // Act - simulate enough time for a drop
      fallingState.update(1000) // 1 second
      
      // Assert
      expect(mockBoard.moveDown).toHaveBeenCalled()
    })

    it('should transition to LOCKING state when tetromino collides after moving down', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep
        .mockReturnValueOnce(false) // First call - no collision
        .mockReturnValueOnce(true)  // Second call - collision after move

      // Act
      fallingState.update(1000)
      
      // Assert
      expect(fallingState.getTransition()).toBe(PlayingStateType.LOCKING)
    })

    it('should add soft drop points when soft dropping', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(false)
      
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

    it.only('should handle hard drop with space key', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(false)
      mockBoard.getPlayfield().hasLineToClear.mockReturnValue(false)
      
      // Act
      fallingState.handleInput(['Space'])
      
      // Assert
      expect(mockBoard.mergeActiveTetromino).toHaveBeenCalled()
      expect(mockScoring.addHardDropPoints).toHaveBeenCalled()
    })

    it('should transition to CLEARING_LINES when hard drop clears lines', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(false)
      mockBoard.getPlayfield().hasLineToClear.mockReturnValue(true)
      
      // Act
      fallingState.handleInput(['Space'])
      
      // Assert
      expect(fallingState.getTransition()).toBe(PlayingStateType.CLEARING_LINES)
    })

    it('should reset combo when hard drop does not clear lines', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(false)
      mockBoard.getPlayfield().hasLineToClear.mockReturnValue(false)
      
      // Act
      fallingState.handleInput(['Space'])
      
      // Assert
      expect(mockScoring.setCombo).toHaveBeenCalledWith(0)
    })
  })

  describe('render', () => {
    it('should call render methods without throwing', () => {
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
      expect(() => fallingState.render(mockCtx)).not.toThrow()
    })
  })
}) 