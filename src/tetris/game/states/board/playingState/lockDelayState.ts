import type Game from '../../..'
import config from '../../../../config'
import { drawBackground } from '../../../../helpers/board'
import imageLoader from '../../../../imageLoader'
import type { InputType } from '../../../../inputHandler'
import { ParentState } from '../../State'
import {
  MovingLeftSubstate,
  MovingRightSubstate,
  RotateSubstate,
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
    rotate: new RotateSubstate(this.game, this),
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

    if (!this.game.board.isColisionInNextStep() || this.lastMoveDeltaTime > this.duration) {
      this.parentState.setSubstate(null)
    }

    if (this.game.board.isColisionInNextStep() && this.lastMoveDeltaTime > this.duration) {
      this.game.board.addShapeToBoard()
      if (this.game.board.isLineToReduce()) {
        this.parentState.setSubstate('clearingLines')
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx)
    this.renderBoard(ctx)
    this.renderShapeOnBoard(ctx)
    super.renderEffects(ctx)
  }

  // TODO: move to helper
  private renderBoard(ctx: CanvasRenderingContext2D) {
    const heap = this.game.board.getHeap()
    const { brickSize } = config.board

    for (let x = 0; x < heap.length; x++) {
      for (let y = 0; y < heap[0].length; y++) {
        const brickImg = imageLoader.getBrickByColor(heap[x][y])
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
  private renderShapeOnBoard(ctx: CanvasRenderingContext2D) {
    const shapeHeap = this.game.board.getShapeOnEmptyBoard()
    const { brickSize } = config.board

    ctx.globalAlpha = 0.5
    for (let x = 0; x < shapeHeap.length; x++) {
      for (let y = 0; y < shapeHeap[0].length; y++) {
        const brickImg = imageLoader.getBrickByColor(shapeHeap[x][y])
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
    ctx.globalAlpha = 1
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
