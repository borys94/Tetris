import { describe, it, expect, beforeEach } from 'vitest'
import Board from '../board'

describe('Board', () => {
  let board: Board

  beforeEach(() => {
    board = new Board()
  })

  describe('holdTetromino', () => {
    it.only('should hold the first tetromino and get next from queue', () => {
      // Arrange
      const initialActiveTetromino = board.getActiveTetromino()
      const initialQueue = [...board.getTetrominoQueue()]

      // Act
      const result = board.holdTetromino()

      // Assert
      expect(result).toBe(true)
      expect(board.getHeldTetromino()).toBeDefined()
      expect(board.getHeldTetromino()?.getType()).toBe(initialActiveTetromino.getType())
      expect(board.getHeldTetromino()?.getColor()).toBe(initialActiveTetromino.getColor())
      expect(board.getActiveTetromino().getType()).toBe(initialQueue[0].getType())
      expect(board.canHoldTetromino()).toBe(false)
    })

    it('should swap with held tetromino on subsequent holds', () => {
      // Arrange - first hold
      board.holdTetromino()
      const heldTetromino = board.getHeldTetromino()
      const secondActive = board.getActiveTetromino()

      // Act - second hold (swap)
      const result = board.holdTetromino()

      // Assert
      expect(result).toBe(true)
      expect(board.getHeldTetromino()?.getType()).toBe(secondActive.getType())
      expect(board.getActiveTetromino().getType()).toBe(heldTetromino?.getType())
    })

    it('should not allow holding when canHold is false', () => {
      // Arrange - first hold
      board.holdTetromino()

      // Act - try to hold again immediately
      const result = board.holdTetromino()

      // Assert
      expect(result).toBe(false)
    })

    it('should reset canHold when spawning new tetromino', () => {
      // Arrange - hold a tetromino
      board.holdTetromino()
      expect(board.canHoldTetromino()).toBe(false)

      // Act - spawn new tetromino (this happens when a tetromino is placed)
      board.spawnTetromino()

      // Assert
      expect(board.canHoldTetromino()).toBe(true)
    })
  })

  describe('getHeldTetromino', () => {
    it('should return null when no tetromino is held', () => {
      expect(board.getHeldTetromino()).toBeNull()
    })

    it('should return the held tetromino after holding', () => {
      // Act
      board.holdTetromino()

      // Assert
      expect(board.getHeldTetromino()).toBeDefined()
      expect(board.getHeldTetromino()?.getType()).toBeDefined()
      expect(board.getHeldTetromino()?.getColor()).toBeDefined()
    })
  })

  describe('canHoldTetromino', () => {
    it('should return true initially', () => {
      expect(board.canHoldTetromino()).toBe(true)
    })

    it('should return false after holding', () => {
      // Act
      board.holdTetromino()

      // Assert
      expect(board.canHoldTetromino()).toBe(false)
    })

    it('should return true after spawning new tetromino', () => {
      // Arrange
      board.holdTetromino()
      expect(board.canHoldTetromino()).toBe(false)

      // Act
      board.spawnTetromino()

      // Assert
      expect(board.canHoldTetromino()).toBe(true)
    })
  })
}) 