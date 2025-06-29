import type { InputType } from '../../inputHandler'
import { drawPlayfield, drawTetromino } from '../../helpers/rendering'
import State from '../state'
import { PlayingStateType } from './playingStateMachine'
import type PlayingState from './index'
import type GameCore from '../../core/gameCore'
import { ShakeEffect } from '../../effects/shakeEffect'

type ContinousMoveType = 'left' | 'right' | 'rotateRight' | 'rotateLeft' | null

export default class FallingState extends State<PlayingStateType> {
  private dropTimer: number = 0
  private dropInterval: number = 1000
  private softDropInterval: number = 80
  private softDropping: boolean = false
  private hardDroppingBlocked: boolean = false

  private continuousMoveInterval: number = 150
  private continuousMoveTimer: number = 0
  private continuousMoveType: ContinousMoveType = null

  private playingState: PlayingState

  constructor(gameCore: GameCore, playingState: PlayingState) {
    super(gameCore)
    this.playingState = playingState
  }

  update(deltaTime: number): void {
    this.updateDropTimer(deltaTime)
    this.handleAutoDrop()
    this.handleContinuousMovement(deltaTime)
  }

  private updateDropTimer(deltaTime: number): void {
    this.dropTimer += deltaTime
  }

  private handleAutoDrop(): void {
    const currentLevel = this.level.getLevel()
    this.dropInterval = Math.max(50, 800 - (currentLevel - 1) * 50)

    const dropInterval = this.softDropping ? this.softDropInterval : this.dropInterval

    if (this.dropTimer >= dropInterval) {
      this.dropTimer = 0
      this.performDrop()
    }
  }

  private performDrop(): void {
    if (!this.board.canActiveTetrominoMoveDown()) {
      if (this.softDropping) {
        this.scoring.addSoftDropPoints(1)
      }
      this.board.moveDown()
    }

    if (this.gameCore.getBoard().canActiveTetrominoMoveDown()) {
      // Tetromino has landed, transition to locking state
      this.setTransition(PlayingStateType.LOCKING)
      return
    }
  }

  private handleContinuousMovement(deltaTime: number): void {
    if (this.continuousMoveType) {
      this.continuousMoveTimer += deltaTime
      if (this.continuousMoveTimer >= this.continuousMoveInterval) {
        this.continuousMoveTimer = 0
        this.performContinuousMove(this.continuousMoveType)
      }
    }
  }

  handleInput(inputs: InputType[]): void {
    this.handleMovementInputs(inputs)
    this.handleHoldInput(inputs)
    this.handleSoftDropInput(inputs)
    this.handleHardDropInput(inputs)
  }

  private handleMovementInputs(inputs: InputType[]): void {
    // Reset move type if no movement keys are pressed
    if (
      !inputs.includes('ArrowLeft') &&
      !inputs.includes('ArrowRight') &&
      !inputs.includes('ArrowUp') &&
      !inputs.includes('KeyZ')
    ) {
      this.setContinuousMoveType(null)
    }

    // Handle movement inputs
    if (inputs.includes('ArrowLeft')) {
      this.setContinuousMoveType('left')
    }
    if (inputs.includes('ArrowRight')) {
      this.setContinuousMoveType('right')
    }
    if (inputs.includes('ArrowUp')) {
      this.setContinuousMoveType('rotateRight')
    }
    if (inputs.includes('KeyZ')) {
      this.setContinuousMoveType('rotateLeft')
    }
  }

  private handleHoldInput(inputs: InputType[]): void {
    if (inputs.includes('KeyC')) {
      this.gameCore.getBoard().holdTetromino()
    }
  }

  private handleSoftDropInput(inputs: InputType[]): void {
    this.softDropping = inputs.includes('ArrowDown')
  }

  private handleHardDropInput(inputs: InputType[]): void {
    if (inputs.includes('Space')) {
      if (!this.hardDroppingBlocked) {
        this.performHardDrop()
      }
    } else {
      this.hardDroppingBlocked = false
    }
  }

  private performHardDrop(): void {
    const board = this.gameCore.getBoard()
    let dropDistance = 0
    
    while (!board.canActiveTetrominoMoveDown()) {
      board.moveDown()
      dropDistance++
    }
    
    board.mergeActiveTetromino()
    this.gameCore.getScoring().addHardDropPoints(dropDistance)
    this.hardDroppingBlocked = true

    if (this.gameCore.getBoard().getPlayfield().hasLineToClear()) {
      this.setTransition(PlayingStateType.CLEARING_LINES)
    } else {
      // No lines cleared, reset combo
      this.gameCore.getScoring().setCombo(0)
      this.setTransition(PlayingStateType.FALLING)
      board.spawnTetromino()
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfield(ctx, this.board.getPlayfield())
    drawTetromino(ctx, this.board.getActiveTetromino(), false)
    drawTetromino(ctx, this.getGhostTetromino(), true)
  }

  enter(): void {
    super.enter()
    this.dropTimer = 0
  }

  private getGhostTetromino() {
    let ghostTetromino = this.board.getActiveTetromino().clone()
    const moved = ghostTetromino.clone()
    while (!this.board.getPlayfield().hasCollision(moved)) {
      ghostTetromino = moved.clone()
      moved.moveDown()
    }

    return ghostTetromino
  }

  private setContinuousMoveType(continuousMoveType: ContinousMoveType): void {
    if (this.continuousMoveType !== continuousMoveType) {
      this.continuousMoveType = continuousMoveType
      this.continuousMoveTimer = 0
      this.performContinuousMove(continuousMoveType)
    }
  }

  private performContinuousMove(continuousMoveType: ContinousMoveType): void {
    switch (continuousMoveType) {
      case 'left':
        if (!this.board.moveLeft()) {
          this.playingState.addEffect(new ShakeEffect(this.gameCore, 'left'))
        }
        break
      case 'right':
        if (!this.board.moveRight()) {
          this.playingState.addEffect(new ShakeEffect(this.gameCore, 'right'))
        }
        break
      case 'rotateRight':
        this.board.rotateRight()
        break
      case 'rotateLeft':
        this.board.rotateLeft()
        break
    }
  }
}
