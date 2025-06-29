import config from '../../config'
import imageLoader from '../../imageLoader'
import State from '../state'
import { PlayingStateType } from './playingStateMachine'
import { TSpinEffect } from '../../effects/tSpinEffect'
import type PlayingState from './index'
import type GameCore from '../../core/gameCore'

export default class ClearingLinesState extends State<PlayingStateType> {
  private clearTimer: number = 0
  private clearDelay: number = 300 // Time to show lines before clearing
  private linesToClear: number[] = []
  private playingState: PlayingState

  constructor(gameCore: GameCore, playingState: PlayingState) {
    super(gameCore)
    this.playingState = playingState
  }

  enter(): void {
    super.enter()
    this.clearTimer = 0
    this.linesToClear = this.getLinesToClear()
  }

  update(deltaTime: number): void {
    this.clearTimer += deltaTime

    if (this.clearTimer >= this.clearDelay) {
      // Detect T-spin before clearing lines
      this.detectAndAwardTSpin()

      // Clear the lines and update level
      const linesCleared = this.linesToClear.length
      this.gameCore.getBoard().getPlayfield().clearLines()
      this.gameCore.getLevel().addClearedLines(linesCleared)
      this.gameCore.getBoard().spawnTetromino()

      this.setTransition(PlayingStateType.FALLING)
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const blocks = this.gameCore.getBoard().getPlayfield().getBlocks()
    const { brickSize } = config.board

    for (const [x, y, color] of blocks) {
      const brickImg = imageLoader.getBrickByColor(color)
      if (brickImg) {
        const reducingLinesBelow = this.linesToClear.filter((v) => v > y).length
        const height = brickSize - (this.clearTimer / this.clearDelay) * brickSize
        if (this.linesToClear.find((v) => v === y)) {
          ctx.globalAlpha = 1 - this.clearTimer / this.clearDelay
          ctx.drawImage(
            brickImg,
            x * brickSize + config.board.margin,
            y * brickSize + config.board.margin + (brickSize - height) * (reducingLinesBelow + 1),
            brickSize,
            height
          )
          ctx.globalAlpha = 1
        } else {
          ctx.drawImage(
            brickImg,
            x * brickSize + config.board.margin,
            y * brickSize + config.board.margin + reducingLinesBelow * (brickSize - height),
            brickSize,
            brickSize
          )
        }
      }
    }
  }

  handleInput(): void {
    // No input handling during line clearing
  }

  private detectAndAwardTSpin(): void {
    const board = this.gameCore.getBoard()
    const tSpinResult = board.detectTSpin()
    const linesCleared = this.linesToClear.length

    // Update combo - if lines are cleared, increment combo
    if (linesCleared > 0) {
      const currentCombo = this.gameCore.getScoring().getCombo()
      this.gameCore.getScoring().setCombo(currentCombo + 1)
    }

    // Note: Combo is reset when no lines are cleared (handled in LockingState and FallingState)

    if (tSpinResult.isTSpin) {
      // Add T-spin effect
      this.playingState.addEffect(new TSpinEffect(this.gameCore, 'T-Spin', linesCleared))

      // Full T-spin
      switch (linesCleared) {
        case 1:
          this.gameCore.getScoring().addTSpinSingle()
          break
        case 2:
          this.gameCore.getScoring().addTSpinDouble()
          break
        case 3:
          this.gameCore.getScoring().addTSpinTriple()
          break
        default:
          // T-spin with no lines cleared (rare but possible)
          this.gameCore.getScoring().addTSpinSingle()
          break
      }
    } else if (tSpinResult.isMiniTSpin) {
      // Add Mini T-spin effect
      this.playingState.addEffect(new TSpinEffect(this.gameCore, 'Mini T-Spin', linesCleared))

      // Mini T-spin
      switch (linesCleared) {
        case 1:
          this.gameCore.getScoring().addMiniTSpinSingle()
          break
        case 2:
          this.gameCore.getScoring().addMiniTSpinDouble()
          break
        default:
          // Mini T-spin with no lines cleared
          this.gameCore.getScoring().addMiniTSpinSingle()
          break
      }
    } else {
      // Regular line clear
      switch (linesCleared) {
        case 0:
          break
        case 1:
          this.gameCore.getScoring().addSingleLine()
          break
        case 2:
          this.gameCore.getScoring().addDoubleLine()
          break
        case 3:
          this.gameCore.getScoring().addTripleLine()
          break
        default:
          this.gameCore.getScoring().addTetris()
          break
      }
    }

    // Add combo points if applicable
    this.gameCore.getScoring().addComboPoints()
  }

  private getLinesToClear() {
    const playfield = this.gameCore.getBoard().getPlayfield()
    const blocks = playfield.getBlocks()
    const width = playfield.getWidth()
    const height = playfield.getHeight()
    const linesToReduce: number[] = []

    for (let y = 0; y < height; y++) {
      if (blocks.filter(([, by]) => by === y).length === width) {
        linesToReduce.push(y)
      }
    }

    return linesToReduce
  }
}
