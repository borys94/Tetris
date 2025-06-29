import { describe, it, expect, beforeEach, vi } from 'vitest'
import TSpinDetector from '../tSpinDetector'
import { TetrominoType } from '../tetrominos/shapes'

describe('TSpinDetector', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPlayfield: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockTetromino: any
  let tSpinDetector: TSpinDetector

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock playfield
    mockPlayfield = {
      hasCollision: vi.fn(),
      getBlocks: vi.fn(() => []),
      getWidth: vi.fn(() => 10),
      getHeight: vi.fn(() => 20),
    }

    // Create mock T-piece tetromino
    mockTetromino = {
      getType: vi.fn(() => TetrominoType.TShape),
      getBlocks: vi.fn(() => [
        [3, 0, 1], // T-piece center
        [2, 1, 1], // T-piece left
        [3, 1, 1], // T-piece center bottom
        [4, 1, 1], // T-piece right
      ]),
      clone: vi.fn(() => ({
        moveDown: vi.fn(),
      })),
    }

    tSpinDetector = new TSpinDetector(mockPlayfield, mockTetromino)
  })

  describe('detectTSpin', () => {
    it('should return false for non-T pieces', () => {
      // Arrange
      mockTetromino.getType.mockReturnValue(TetrominoType.IShape)

      // Act
      const result = tSpinDetector.detectTSpin(true)

      // Assert
      expect(result.isTSpin).toBe(false)
      expect(result.isMiniTSpin).toBe(false)
      expect(result.cornerCount).toBe(0)
    })

    it('should return false when last move was not rotation', () => {
      // Arrange
      mockPlayfield.hasCollision.mockReturnValue(true) // Tetromino is locked

      // Act
      const result = tSpinDetector.detectTSpin(false)

      // Assert
      expect(result.isTSpin).toBe(false)
      expect(result.isMiniTSpin).toBe(false)
    })

    it('should return false when tetromino is not locked', () => {
      // Arrange
      mockPlayfield.hasCollision.mockReturnValue(false) // Tetromino can move down

      // Act
      const result = tSpinDetector.detectTSpin(true)

      // Assert
      expect(result.isTSpin).toBe(false)
      expect(result.isMiniTSpin).toBe(false)
    })

    it('should detect full T-spin with 3 occupied corners', () => {
      // Arrange
      mockPlayfield.hasCollision.mockReturnValue(true) // Tetromino is locked
      mockPlayfield.getBlocks.mockReturnValue([
        [2, 0, 1], // Top-left corner occupied
        [4, 0, 1], // Top-right corner occupied
        [2, 2, 1], // Bottom-left corner occupied
        // Bottom-right corner empty
      ])

      // Act
      const result = tSpinDetector.detectTSpin(true)

      // Assert
      expect(result.isTSpin).toBe(true)
      expect(result.isMiniTSpin).toBe(false)
      expect(result.cornerCount).toBe(3)
    })

    it('should detect full T-spin with 4 occupied corners', () => {
      // Arrange
      mockPlayfield.hasCollision.mockReturnValue(true) // Tetromino is locked
      mockPlayfield.getBlocks.mockReturnValue([
        [2, 0, 1], // Top-left corner occupied
        [4, 0, 1], // Top-right corner occupied
        [2, 2, 1], // Bottom-left corner occupied
        [4, 2, 1], // Bottom-right corner occupied
      ])

      // Act
      const result = tSpinDetector.detectTSpin(true)

      // Assert
      expect(result.isTSpin).toBe(true)
      expect(result.isMiniTSpin).toBe(false)
      expect(result.cornerCount).toBe(4)
    })

    it('should detect mini T-spin with 2 occupied corners', () => {
      // Arrange
      mockPlayfield.hasCollision.mockReturnValue(true) // Tetromino is locked
      mockPlayfield.getBlocks.mockReturnValue([
        [2, 0, 1], // Top-left corner occupied
        [4, 0, 1], // Top-right corner occupied
        // Bottom corners empty
      ])

      // Act
      const result = tSpinDetector.detectTSpin(true)

      // Assert
      expect(result.isTSpin).toBe(false)
      expect(result.isMiniTSpin).toBe(true)
      expect(result.cornerCount).toBe(2)
    })

    it('should return false with 1 or 0 occupied corners', () => {
      // Arrange
      mockPlayfield.hasCollision.mockReturnValue(true) // Tetromino is locked
      mockPlayfield.getBlocks.mockReturnValue([
        [2, 0, 1], // Only top-left corner occupied
        // Other corners empty
      ])

      // Act
      const result = tSpinDetector.detectTSpin(true)

      // Assert
      expect(result.isTSpin).toBe(false)
      expect(result.isMiniTSpin).toBe(false)
      expect(result.cornerCount).toBe(1)
    })

    it('should handle wall collisions as occupied corners', () => {
      // Arrange
      mockPlayfield.hasCollision.mockReturnValue(true) // Tetromino is locked
      mockPlayfield.getBlocks.mockReturnValue([]) // No placed blocks

      // Set T-piece at left edge (x=0) so left corners are outside playfield
      mockTetromino.getBlocks.mockReturnValue([
        [1, 18, 1], // T-piece center (at x=1)
        [0, 19, 1], // T-piece left (at x=0, edge)
        [1, 19, 1], // T-piece center bottom
        [2, 19, 1], // T-piece right
      ])

      // Act
      const result = tSpinDetector.detectTSpin(true)

      // Assert
      // Should detect some corners as occupied due to walls
      expect(result.cornerCount).toBeGreaterThan(0)
    })
  })
})
