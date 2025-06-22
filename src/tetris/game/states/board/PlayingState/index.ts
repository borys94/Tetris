import type Game from '../../..'
import ImageLoader from '../../../../imageLoader'
import type { InputType } from '../../../../inputHandler'
import { TetrisStateWithSubstates } from '../../State'
import { ClearingLinesSubstate } from './clearingLinesSubstate'
import { HardDropSubstate } from './hardDropSubstate'
import { MovingLeftSubstate, MovingRightSubstate, RotateSubstate } from './moveSubstate'
import type { PlayingSubstate } from './playingSubstate'
import { SoftDropSubstate } from './softDropSubstate'
import config from '../../../../config'
import type { Effect } from '../../../effects/effect'
import { drawBackground } from '../../../../helpers/board'

export type PlayingStateType =
  | 'softDrop'
  | 'hardDrop'
  | 'rotate'
  | 'movingLeft'
  | 'movingRight'
  | 'clearingLines'

export class PlayingState extends TetrisStateWithSubstates {
  private lastUpdate = 0
  private lastPrevState = 0

  protected substates: Record<PlayingStateType, PlayingSubstate> = {
    softDrop: new SoftDropSubstate(this.game, this),
    hardDrop: new HardDropSubstate(this.game, this),
    rotate: new RotateSubstate(this.game, this),
    movingLeft: new MovingLeftSubstate(this.game, this),
    movingRight: new MovingRightSubstate(this.game, this),
    clearingLines: new ClearingLinesSubstate(this.game, this),
  }
  protected currentSubstate: PlayingSubstate | null = null

  protected effects: Effect[] = []

  constructor(protected game: Game) {
    super(game)
  }

  addEffect(effect: Effect) {
    this.effects.push(effect)
  }

  enter() {
    this.lastUpdate = 0
    this.lastPrevState = 0
  }

  // TODO: refactor this
  update(deltaTime: number) {
    this.game.gameTime += deltaTime
    this.lastPrevState += deltaTime

    this.effects = this.effects.filter((effect) => {
      effect.update(deltaTime)
      return !effect.isFinished()
    })

    if (this.currentSubstate) {
      this.currentSubstate.update(deltaTime)

      if (this.currentSubstate.isParentUpdateDisabled()) {
        this.lastUpdate = 0
        return
      }
    }

    if (this.lastUpdate > 500) {
      this.lastUpdate = 0
      if (this.game.board.isColisionInNextStep()) {
        this.game.board.addShapeToBoard()
        if (this.game.board.isLineToReduce()) {
          this.setSubstate('clearingLines')
          this.game.score.addPoints(1)
        }
        return
      }
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
    this.effects.forEach((effect) => effect.render(ctx))
  }

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
