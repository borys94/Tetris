import { INPUT_KEYS, type InputType } from '../../inputHandler'
import { drawPlayfield, drawTetromino } from '../../helpers/rendering'
import State from '../state'
import { PlayingStateType } from './playingStateMachine'
import type PlayingState from './index'
import type GameCore from '../../core/gameCore'
import { ShakeEffect } from '../../effects/shakeEffect'

type ContinuousMoveType = 'left' | 'right' | 'rotateRight' | 'rotateLeft' | null

// Constants for better maintainability
const DROP_INTERVALS = {
  MIN_INTERVAL: 50,
  BASE_INTERVAL: 800,
  LEVEL_MULTIPLIER: 50,
  SOFT_DROP_INTERVAL: 80,
  CONTINUOUS_MOVE_INTERVAL: 150,
} as const

export default class FallingState extends State<PlayingStateType> {
  private dropTimer: number = 0
  private softDropping: boolean = false
  private hardDroppingBlocked: boolean = false

  private continuousMoveTimer: number = 0
  private continuousMoveType: ContinuousMoveType = null

  private readonly playingState: PlayingState

  constructor(gameCore: GameCore, playingState: PlayingState) {
    super(gameCore)
    this.playingState = playingState
  }

  enter(): void {
    super.enter()
    this.resetTimers()
  }

  update(deltaTime: number): void {
    this.updateDropTimer(deltaTime)
    this.handleAutoDrop()
    this.handleContinuousMovement(deltaTime)
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfield(ctx, this.board.getPlayfield())
    drawTetromino(ctx, this.board.getActiveTetromino(), false)
    drawTetromino(ctx, this.getGhostTetromino(), true)
  }

  handleInput(inputs: InputType[]): void {
    this.handleMovementInputs(inputs)
    this.handleHoldInput(inputs)
    this.handleSoftDropInput(inputs)
    this.handleHardDropInput(inputs)
  }

  private resetTimers(): void {
    this.resetDropTimer()
    this.resetContinuousMoveTimer()
  }

  private updateDropTimer(deltaTime: number): void {
    this.dropTimer += deltaTime
  }

  private handleAutoDrop(): void {
    const dropInterval = this.calculateDropInterval()

    if (this.shouldPerformDrop(dropInterval)) {
      this.resetDropTimer()
      this.performDrop()
    }
  }

  private shouldPerformDrop(dropInterval: number): boolean {
    return this.dropTimer >= dropInterval
  }

  private resetDropTimer(): void {
    this.dropTimer = 0
  }

  private calculateDropInterval(): number {
    const currentLevel = this.level.getLevel()
    const normalDropInterval = this.calculateNormalDropInterval(currentLevel)
    return this.softDropping ? DROP_INTERVALS.SOFT_DROP_INTERVAL : normalDropInterval
  }

  private calculateNormalDropInterval(level: number): number {
    return Math.max(
      DROP_INTERVALS.MIN_INTERVAL,
      DROP_INTERVALS.BASE_INTERVAL - (level - 1) * DROP_INTERVALS.LEVEL_MULTIPLIER
    )
  }

  private performDrop(): void {
    if (this.shouldMoveTetrominoDown()) {
      this.moveTetrominoDown()
    }

    if (this.hasTetrominoLanded()) {
      this.transitionToLockingState()
    }
  }

  private shouldMoveTetrominoDown(): boolean {
    return this.board.canActiveTetrominoMoveDown()
  }

  private moveTetrominoDown(): void {
    if (this.softDropping) {
      this.scoring.addSoftDropPoints(1)
    }
    this.board.moveDown()
  }

  private hasTetrominoLanded(): boolean {
    return !this.board.canActiveTetrominoMoveDown()
  }

  private transitionToLockingState(): void {
    this.setTransition(PlayingStateType.LOCKING)
  }

  /** When player is holding down a movement key, this function will perform the movement continuously */
  private handleContinuousMovement(deltaTime: number): void {
    if (!this.continuousMoveType) return

    this.continuousMoveTimer += deltaTime
    if (this.shouldPerformContinuousMove()) {
      this.resetContinuousMoveTimer()
      this.performContinuousMove(this.continuousMoveType)
    }
  }

  private shouldPerformContinuousMove(): boolean {
    return this.continuousMoveTimer >= DROP_INTERVALS.CONTINUOUS_MOVE_INTERVAL
  }

  private resetContinuousMoveTimer(): void {
    this.continuousMoveTimer = 0
  }

  private handleMovementInputs(inputs: InputType[]): void {
    this.resetMovementIfNoKeysPressed(inputs)
    this.setMovementTypeFromInputs(inputs)
  }

  private resetMovementIfNoKeysPressed(inputs: InputType[]): void {
    const movementKeys = [
      INPUT_KEYS.LEFT,
      INPUT_KEYS.RIGHT,
      INPUT_KEYS.ROTATE_RIGHT,
      INPUT_KEYS.ROTATE_LEFT,
    ]

    const hasNoMovementKeys = movementKeys.every((key) => !inputs.includes(key))
    if (hasNoMovementKeys) {
      this.setContinuousMoveType(null)
    }
  }

  private setMovementTypeFromInputs(inputs: InputType[]): void {
    const movementMap = {
      [INPUT_KEYS.LEFT]: 'left' as const,
      [INPUT_KEYS.RIGHT]: 'right' as const,
      [INPUT_KEYS.ROTATE_RIGHT]: 'rotateRight' as const,
      [INPUT_KEYS.ROTATE_LEFT]: 'rotateLeft' as const,
    }

    for (const [key, moveType] of Object.entries(movementMap)) {
      if (inputs.includes(key as InputType)) {
        this.setContinuousMoveType(moveType)
        break
      }
    }
  }

  private handleHoldInput(inputs: InputType[]): void {
    if (inputs.includes(INPUT_KEYS.HOLD)) {
      this.board.holdTetromino()
    }
  }

  private handleSoftDropInput(inputs: InputType[]): void {
    this.softDropping = inputs.includes(INPUT_KEYS.DOWN)
  }

  private handleHardDropInput(inputs: InputType[]): void {
    if (inputs.includes(INPUT_KEYS.HARD_DROP)) {
      if (!this.hardDroppingBlocked) {
        this.performHardDrop()
      }
    } else {
      this.hardDroppingBlocked = false
    }
  }

  private performHardDrop(): void {
    const dropDistance = this.calculateDropDistance()
    this.executeHardDrop(dropDistance)
    this.handlePostHardDropState()
  }

  private calculateDropDistance(): number {
    const movedTetromino = this.board.getActiveTetromino().clone()
    let dropDistance = 0
    while (!this.board.getPlayfield().hasCollision(movedTetromino)) {
      movedTetromino.moveDown()
      dropDistance++
    }
    return dropDistance - 1
  }

  private executeHardDrop(dropDistance: number): void {
    this.board.getActiveTetromino().move(0, dropDistance)
    this.board.mergeActiveTetromino()
    this.gameCore.getScoring().addHardDropPoints(dropDistance)
    this.hardDroppingBlocked = true
  }

  private handlePostHardDropState(): void {
    if (this.board.getPlayfield().hasLineToClear()) {
      this.setTransition(PlayingStateType.CLEARING_LINES)
    } else {
      this.handleNoLinesCleared()
    }
  }

  private handleNoLinesCleared(): void {
    this.scoring.setCombo(0)
    this.setTransition(PlayingStateType.FALLING)
    this.board.spawnTetromino()
  }

  private getGhostTetromino() {
    const ghostTetromino = this.board.getActiveTetromino().clone()
    let dropDistance = this.calculateDropDistance()
    while (dropDistance-- > 0) {
      ghostTetromino.moveDown()
    }
    return ghostTetromino
  }

  private setContinuousMoveType(continuousMoveType: ContinuousMoveType): void {
    if (this.continuousMoveType !== continuousMoveType) {
      this.continuousMoveType = continuousMoveType
      this.resetContinuousMoveTimer()
      this.performContinuousMove(continuousMoveType)
    }
  }

  private performContinuousMove(continuousMoveType: ContinuousMoveType): void {
    if (!continuousMoveType) return

    const moveActions = {
      left: () => this.tryMoveLeft(),
      right: () => this.tryMoveRight(),
      rotateRight: () => this.board.rotateRight(),
      rotateLeft: () => this.board.rotateLeft(),
    }

    moveActions[continuousMoveType]()
  }

  private tryMoveLeft(): void {
    if (!this.board.moveLeft()) {
      this.playingState.addEffect(new ShakeEffect(this.gameCore, 'left'))
    }
  }

  private tryMoveRight(): void {
    if (!this.board.moveRight()) {
      this.playingState.addEffect(new ShakeEffect(this.gameCore, 'right'))
    }
  }
}
