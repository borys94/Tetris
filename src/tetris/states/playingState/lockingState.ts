import { INPUT_KEYS, type InputType } from '../../inputHandler'
import { PlayingStateType } from './playingStateMachine'
import State from '../state'
import { drawPlayfield, drawTetromino } from '../../helpers/rendering'

type ContinuousMoveType = 'left' | 'right' | 'rotateRight' | 'rotateLeft' | null

const CONTINUOUS_MOVE_INTERVAL = 150
const LOCK_DELAY = 700 // 700ms to allow for last-minute moves

export default class LockingState extends State<PlayingStateType> {
  private lockTimer: number = 0
  private continuousMoveType: ContinuousMoveType = null
  private continuousMoveTimer: number = 0

  enter(): void {
    super.enter()
    this.resetTimers()
  }

  update(deltaTime: number): void {
    this.updateLockTimer(deltaTime)

    if (this.canTetrominoMoveDown()) {
      this.transitionToFallingState()
      return
    }

    if (this.hasLockDelayExpired()) {
      this.handleLockDelayExpired()
    } else {
      this.handleContinuousMovement(deltaTime)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfield(ctx, this.board.getPlayfield())
    drawTetromino(ctx, this.board.getActiveTetromino(), true)
  }

  handleInput(inputs: InputType[]): void {
    this.resetMovementIfNoKeysPressed(inputs)
    this.setMovementTypeFromInputs(inputs)
  }

  private resetTimers(): void {
    this.lockTimer = 0
    this.continuousMoveTimer = 0
  }

  private updateLockTimer(deltaTime: number): void {
    this.lockTimer += deltaTime
  }

  private canTetrominoMoveDown(): boolean {
    return this.board.canActiveTetrominoMoveDown()
  }

  private transitionToFallingState(): void {
    this.setTransition(PlayingStateType.FALLING)
  }

  private hasLockDelayExpired(): boolean {
    return this.lockTimer >= LOCK_DELAY
  }

  private handleContinuousMovement(deltaTime: number): void {
    if (!this.continuousMoveType) return

    this.continuousMoveTimer += deltaTime
    if (this.shouldPerformContinuousMove()) {
      this.resetContinuousMoveTimer()
      this.performContinuousMove(this.continuousMoveType)
    }
  }

  private shouldPerformContinuousMove(): boolean {
    return this.continuousMoveTimer >= CONTINUOUS_MOVE_INTERVAL
  }

  private resetContinuousMoveTimer(): void {
    this.continuousMoveTimer = 0
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

  private handleLockDelayExpired(): void {
    this.board.mergeActiveTetromino()
    this.handlePostMergeState()
  }

  private handlePostMergeState(): void {
    if (this.board.getPlayfield().hasLineToClear()) {
      this.setTransition(PlayingStateType.CLEARING_LINES)
    } else {
      this.handleNoLinesCleared()
    }
  }

  private handleNoLinesCleared(): void {
    this.scoring.setCombo(0)
    this.board.spawnTetromino()
    this.setTransition(PlayingStateType.FALLING)
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
      left: () => this.board.moveLeft(),
      right: () => this.board.moveRight(),
      rotateRight: () => this.board.rotateRight(),
      rotateLeft: () => this.board.rotateLeft(),
    }

    moveActions[continuousMoveType]()
  }
}
