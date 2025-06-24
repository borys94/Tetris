import type Game from '../../..'
import {
  drawActiveTetromino,
  drawPlayfieldBackground,
  renderPlayfield,
} from '../../../../helpers/renderer'
import type { InputType } from '../../../../inputHandler'
import { ParentState } from '../../State'
import {
  MovingLeftSubstate,
  MovingRightSubstate,
  RotateRightSubstate,
  type MoveSubstate,
} from './moveSubstate'

export class LockDelaySubstate extends ParentState {
  private duration = 700
  private lastMoveDeltaTime = 0

  protected parentState: ParentState
  protected disableParentUpdate = true

  protected currentSubstate: MoveSubstate | null = null
  protected substates: Record<string, MoveSubstate> = {
    movingLeft: new MovingLeftSubstate(this.game, this),
    movingRight: new MovingRightSubstate(this.game, this),
    rotate: new RotateRightSubstate(this.game, this),
  }

  constructor(game: Game, parentState: ParentState) {
    super(game, parentState)
    this.parentState = parentState
  }

  setSubstate(substate: string) {
    super.setSubstate(substate)

    if (this.currentSubstate?.isInitialMovePerformed()) {
      this.lastMoveDeltaTime = 0
    }
  }

  enter() {
    this.lastMoveDeltaTime = 0
  }

  update(deltaTime: number) {
    super.updateEffects(deltaTime)

    if (this.currentSubstate?.update(deltaTime)) {
      this.lastMoveDeltaTime = 0
    } else {
      this.lastMoveDeltaTime += deltaTime
    }

    if (!this.game.board.hasCollisionInNextStep() || this.lastMoveDeltaTime > this.duration) {
      this.parentState.setSubstate(null)
    }

    if (this.game.board.hasCollisionInNextStep() && this.lastMoveDeltaTime > this.duration) {
      this.game.board.mergeActiveTetromino()
      if (this.game.board.getPlayfield().hasLineToReduce()) {
        this.parentState.setSubstate('clearingLines')
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    drawPlayfieldBackground(ctx)
    renderPlayfield(ctx, this.game.board)
    drawActiveTetromino(ctx, this.game.board, 0.5)
    super.renderEffects(ctx)
  }

  handleInput(inputs: InputType[]) {
    if (this.currentSubstate) {
      this.currentSubstate?.handleInput(inputs)
      return
    }

    if (inputs.includes('ArrowLeft')) {
      this.setSubstate('movingLeft')
    }

    if (inputs.includes('ArrowRight')) {
      this.setSubstate('movingRight')
    }

    if (inputs.includes('ArrowUp')) {
      this.setSubstate('rotate')
    }
  }
}
