import { ShakeLeftEffect, ShakeRightEffect } from '../../../effects/shakeEffect'
import type { InputType } from '../../../../inputHandler'
import { ChildState } from '../../State'

export abstract class MoveSubstate extends ChildState {
  private elapsed = 0
  private duration = 200

  protected canMove = true
  protected abstract key: InputType

  private initialMovePerformed = false

  enter() {
    this.elapsed = 0
    this.initialMovePerformed = this.performMove()
  }

  update(deltaTime: number): boolean {
    this.elapsed += deltaTime
    if (this.elapsed >= this.duration) {
      this.elapsed -= this.duration
      if (this.performMove()) {
        return true
      }
    }
    return false
  }

  render() {}

  handleInput(inputs: InputType[]) {
    if (!inputs.includes(this.key)) {
      this.parentState.setSubstate(null)
    }
  }

  isInitialMovePerformed() {
    return this.initialMovePerformed
  }

  abstract performMove(): boolean
}

export class RotateSubstate extends MoveSubstate {
  protected key = 'ArrowUp' as const

  performMove() {
    return this.game.board.rotate()
  }
}

export class MovingLeftSubstate extends MoveSubstate {
  protected key = 'ArrowLeft' as const

  performMove() {
    const canMove = this.game.board.moveLeft()
    if (!canMove) {
      this.parentState.addEffect(new ShakeLeftEffect(this.game))
    }
    return canMove
  }
}

export class MovingRightSubstate extends MoveSubstate {
  protected key = 'ArrowRight' as const

  performMove() {
    const canMove = this.game.board.moveRight()
    if (!canMove) {
      this.parentState.addEffect(new ShakeRightEffect(this.game))
    }
    return canMove
  }
}
