import { describe, it, expect, beforeEach, vi } from 'vitest'
import LockingState from '../lockingState'
import { PlayingStateType } from '../playingStateMachine'

// Mock GameCore
vi.mock('../../../core/gameCore')

describe('LockingState', () => {
  let lockingState: LockingState
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGameCore: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockBoard: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockScoring: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPlayfield: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock objects
    mockPlayfield = {
      hasLineToClear: vi.fn(() => false),
    }

    mockBoard = {
      hasCollisionInNextStep: vi.fn(() => true),
      moveDown: vi.fn(),
      moveLeft: vi.fn(),
      moveRight: vi.fn(),
      rotateRight: vi.fn(),
      rotateLeft: vi.fn(),
      mergeActiveTetromino: vi.fn(),
      spawnTetromino: vi.fn(),
    }

    mockScoring = {
      addSoftDropPoints: vi.fn(),
      setCombo: vi.fn(),
    }

    mockGameCore = {
      getBoard: vi.fn(() => mockBoard),
      getScoring: vi.fn(() => mockScoring),
    }

    // Create LockingState instance
    lockingState = new LockingState(mockGameCore)
  })

  describe('update', () => {
    it('should transition to FALLING when tetromino can move down', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(false)
      
      // Act
      lockingState.update(100)
      
      // Assert
      expect(lockingState.getTransition()).toBe(PlayingStateType.FALLING)
    })

    it('should transition to CLEARING_LINES when lines can be cleared', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(true)
      mockPlayfield.hasLineToClear.mockReturnValue(true)
      
      // Act - wait for lock delay
      lockingState.update(700) // 700ms lock delay
      
      // Assert
      expect(lockingState.getTransition()).toBe(PlayingStateType.CLEARING_LINES)
    })

    it('should transition to FALLING when no lines can be cleared', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(true)
      mockPlayfield.hasLineToClear.mockReturnValue(false)
      
      // Act - wait for lock delay
      lockingState.update(700) // 700ms lock delay
      
      // Assert
      expect(lockingState.getTransition()).toBe(PlayingStateType.FALLING)
    })

    it('should merge tetromino and spawn new one after lock delay', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(true)
      mockPlayfield.hasLineToClear.mockReturnValue(false)
      
      // Act - wait for lock delay
      lockingState.update(700)
      
      // Assert
      expect(mockBoard.mergeActiveTetromino).toHaveBeenCalled()
      expect(mockBoard.spawnTetromino).toHaveBeenCalled()
    })

    it('should reset combo when no lines are cleared', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(true)
      mockPlayfield.hasLineToClear.mockReturnValue(false)
      
      // Act - wait for lock delay
      lockingState.update(700)
      
      // Assert
      expect(mockScoring.setCombo).toHaveBeenCalledWith(0)
    })
  })

  describe('handleInput', () => {
    it('should handle left arrow input', () => {
      // Act
      lockingState.handleInput(['ArrowLeft'])
      
      // Assert
      expect(mockBoard.moveLeft).toHaveBeenCalled()
    })

    it('should handle right arrow input', () => {
      // Act
      lockingState.handleInput(['ArrowRight'])
      
      // Assert
      expect(mockBoard.moveRight).toHaveBeenCalled()
    })

    it('should handle up arrow input (rotate right)', () => {
      // Act
      lockingState.handleInput(['ArrowUp'])
      
      // Assert
      expect(mockBoard.rotateRight).toHaveBeenCalled()
    })

    it('should handle Z key input (rotate left)', () => {
      // Act
      lockingState.handleInput(['KeyZ'])
      
      // Assert
      expect(mockBoard.rotateLeft).toHaveBeenCalled()
    })

    it('should handle soft drop during lock delay', () => {
      // Act
      lockingState.handleInput(['ArrowDown'])
      
      // Assert
      expect(mockBoard.moveDown).toHaveBeenCalled()
      expect(mockScoring.addSoftDropPoints).toHaveBeenCalledWith(1)
    })

    it('should reset lock timer on soft drop', () => {
      // Arrange
      mockBoard.hasCollisionInNextStep.mockReturnValue(true)
      
      // Act - advance timer, then soft drop
      lockingState.update(500) // 500ms into lock delay
      lockingState.handleInput(['ArrowDown'])
      lockingState.update(100) // 100ms more
      
      // Assert - should not have transitioned yet (timer reset)
      expect(lockingState.getTransition()).toBeNull()
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
      expect(() => lockingState.render(mockCtx)).not.toThrow()
    })
  })

  describe('enter', () => {
    it('should initialize lock timer', () => {
      // Act
      lockingState.enter()
      
      // Assert - should not transition immediately
      expect(lockingState.getTransition()).toBeNull()
    })
  })
}) 