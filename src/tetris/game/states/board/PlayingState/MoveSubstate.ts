import type { PlayingState } from '.'
import { ShakeLeftEffect, ShakeRightEffect } from '../../../effects/shakeEffect'
import type Game from '../../..'
import { PlayingSubstate } from './playingSubstate'

abstract class MoveSubstate extends PlayingSubstate {
  protected elapsed = 0
  protected duration = 150
  protected canMove = true

  constructor(
    game: Game,
    protected parentState: PlayingState
  ) {
    super(game, parentState)
  }

  enter(): void {
    this.elapsed = 0
  }

  update(deltaTime: number) {
    this.elapsed += deltaTime
    if (this.elapsed >= this.duration) {
      this.parentState.setSubstate(null)
    }
  }

  render() {}

  handleInput() {}
}

export class RotateSubstate extends MoveSubstate {
  enter(): void {
    super.enter()
    this.canMove = this.game.board.rotate()
  }
}

export class MovingLeftSubstate extends MoveSubstate {
  enter(): void {
    super.enter()
    if (!this.game.board.moveLeft()) {
      this.parentState.addEffect(new ShakeLeftEffect(this.game))
    }
  }
}

export class MovingRightSubstate extends MoveSubstate {
  enter(): void {
    super.enter()
    if (!this.game.board.moveRight()) {
      this.parentState.addEffect(new ShakeRightEffect(this.game))
    }
  }
}
