import type { InputType } from '../../../../inputHandler'
import { ParentState, State } from '../../State'
import { ClearingLinesSubstate } from './clearingLinesSubstate'
import { HardDropSubstate } from './hardDropSubstate'
import { MovingLeftSubstate, MovingRightSubstate, RotateLeftSubstate, RotateRightSubstate } from './moveSubstate'
import { SoftDropSubstate } from './softDropSubstate'
import { drawPlayfieldBackground, renderPlayfield } from '../../../../helpers/renderer'
import { LockDelaySubstate } from './lockDelayState'
import { BlockDropSubstate } from './blockDropSubstate'
import { drawActiveTetromino, drawGhostTetromino } from '../../../../helpers/renderer'

export type PlayingStateType =
  | 'softDrop'
  | 'hardDrop'
  | 'rotateRight'
  | 'rotateLeft'
  | 'movingLeft'
  | 'movingRight'
  | 'clearingLines'
  | 'lockDelay'
  | 'blockDrop'

export class PlayingState extends ParentState {
  private lastUpdate = 0
  private lastPrevState = 0

  protected substates: Record<PlayingStateType, State> = {
    softDrop: new SoftDropSubstate(this.game, this),
    hardDrop: new HardDropSubstate(this.game, this),
    rotateRight: new RotateRightSubstate(this.game, this),
    rotateLeft: new RotateLeftSubstate(this.game, this),
    movingLeft: new MovingLeftSubstate(this.game, this),
    movingRight: new MovingRightSubstate(this.game, this),
    clearingLines: new ClearingLinesSubstate(this.game, this),
    lockDelay: new LockDelaySubstate(this.game, this),
    blockDrop: new BlockDropSubstate(this.game, this),
  }
  protected currentSubstate: State | null = null

  enter() {
    this.lastUpdate = 0
    this.lastPrevState = 0
  }

  setSubstate(substate: PlayingStateType | null) {
    super.setSubstate(substate)
  }

  // TODO: refactor this
  update(deltaTime: number) {
    this.game.gameTime += deltaTime
    this.lastPrevState += deltaTime

    super.updateEffects(deltaTime)

    if (this.currentSubstate) {
      if (this.currentSubstate?.isParentUpdateDisabled()) {
        this.lastUpdate = 0
      }
      this.currentSubstate.update(deltaTime)

      // update may change current substate
      if (this.currentSubstate?.isParentUpdateDisabled()) {
        return
      }
    }

    if (this.game.board.hasCollisionInNextStep()) {
      this.lastUpdate = 0
      this.setSubstate('lockDelay')
      return
    }

    if (this.lastUpdate > 500) {
      this.lastUpdate = 0
      this.game.board.moveDown()
    }
    this.lastUpdate += deltaTime
  }

  render(ctx: CanvasRenderingContext2D) {
    drawPlayfieldBackground(ctx)
    renderPlayfield(ctx, this.game.board)
    drawGhostTetromino(ctx, this.game.board)
    drawActiveTetromino(ctx, this.game.board)
    this.currentSubstate?.render(ctx)
    this.renderEffects(ctx)
  }

  // TODO: handle in different way pause state
  handleInput(inputs: InputType[]) {
    if (this.lastPrevState > 500 && (inputs.includes('Escape') || inputs.includes('KeyP'))) {
      this.game.setBoardPanelState('paused')
      return
    }

    if (this.currentSubstate) {
      this.currentSubstate?.handleInput(inputs)
      return
    }

    if (inputs.includes('ArrowLeft')) {
      this.setSubstate('movingLeft')
    } else if (inputs.includes('ArrowRight')) {
      this.setSubstate('movingRight')
    } else if (inputs.includes('ArrowUp')) {
      this.setSubstate('rotateRight')
    } else if (inputs.includes('KeyZ')) {
      this.setSubstate('rotateLeft')
    } else if (inputs.includes('ArrowDown')) {
      this.setSubstate('softDrop')
    } else if (inputs.includes('Space')) {
      this.setSubstate('hardDrop')
    }
  }
}
