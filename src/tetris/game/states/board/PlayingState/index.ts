import ImageLoader from '../../../../imageLoader'
import type { InputType } from '../../../../inputHandler'
import { ParentState, State } from '../../State'
import { ClearingLinesSubstate } from './clearingLinesSubstate'
import { HardDropSubstate } from './hardDropSubstate'
import { MovingLeftSubstate, MovingRightSubstate, RotateSubstate } from './moveSubstate'
import { SoftDropSubstate } from './softDropSubstate'
import config from '../../../../config'
import { drawBackground } from '../../../../helpers/board'
import { LockDelaySubstate } from './lockDelayState'
import { BlockDropSubstate } from './blockDropSubstate'

export type PlayingStateType =
  | 'softDrop'
  | 'hardDrop'
  | 'rotate'
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
    rotate: new RotateSubstate(this.game, this),
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

    if (this.game.board.isColisionInNextStep()) {
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
    drawBackground(ctx)
    this.renderBoard(ctx)
    this.renderShadow(ctx)
    this.renderShapeOnBoard(ctx)
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
      this.setSubstate('rotate')
    } else if (inputs.includes('ArrowDown')) {
      this.setSubstate('softDrop')
    } else if (inputs.includes('Space')) {
      this.setSubstate('hardDrop')
    }
  }

  // TODO: move to helper
  private renderShapeOnBoard(ctx: CanvasRenderingContext2D) {
    const shapeHeap = this.game.board.getShapeOnEmptyBoard()
    const { brickSize } = config.board

    for (let x = 0; x < shapeHeap.length; x++) {
      for (let y = 0; y < shapeHeap[0].length; y++) {
        const brickImg = ImageLoader.getBrickByColor(shapeHeap[x][y])
        if (shapeHeap[x][y] && brickImg) {
          ctx.drawImage(
            brickImg,
            y * brickSize + config.board.margin,
            x * brickSize + config.board.margin,
            brickSize,
            brickSize
          )
        }
      }
    }
  }

  // TODO: move to helper
  private renderBoard(ctx: CanvasRenderingContext2D) {
    const heap = this.game.board.getHeap()
    const { brickSize } = config.board

    for (let x = 0; x < heap.length; x++) {
      for (let y = 0; y < heap[0].length; y++) {
        const brickImg = ImageLoader.getBrickByColor(heap[x][y])
        if (heap[x][y] && brickImg) {
          ctx.drawImage(
            brickImg,
            y * brickSize + config.board.margin,
            x * brickSize + config.board.margin,
            brickSize,
            brickSize
          )
        }
      }
    }
  }

  // TODO: move to helper
  private renderShadow(ctx: CanvasRenderingContext2D) {
    // TODO: ghost piece
    const shapeHeap = this.game.board.getShadowOnEmptyBoard()
    const { brickSize } = config.board
    ctx.fillStyle = `rgb(204, 204, 204)`

    for (let x = 0; x < shapeHeap.length; x++) {
      for (let y = 0; y < shapeHeap[0].length; y++) {
        if (shapeHeap[x][y] === -1) {
          ctx.fillRect(
            y * brickSize + config.board.margin,
            x * brickSize + config.board.margin,
            brickSize,
            brickSize
          )
        }
      }
    }
  }
}
