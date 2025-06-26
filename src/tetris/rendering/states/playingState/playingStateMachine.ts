import type GameCore from "../../../core/gameCore"
import FallingState from "./fallingState"
import LockingState from "./lockingState"
import ClearingLinesState from "./clearingLinesState"
import SpawningState from "./spawningState"
import LineClearAnimationState from "./lineClearAnimationState"
import type GameState from "../gameState"
import StateMachine from "../../stateMachine"

export enum PlayingStateType {
  FALLING = 'FALLING',
  CLEARING_LINES = 'CLEARING_LINES',
  SPAWNING = 'SPAWNING',
  LOCKING = 'LOCKING',
  LINE_CLEAR_ANIMATION = 'LINE_CLEAR_ANIMATION'
} 

export class PlayingStateMachine extends StateMachine<PlayingStateType> {
  protected currentState: GameState<PlayingStateType>
  protected states: Map<PlayingStateType, GameState<PlayingStateType>>

  constructor(gameCore: GameCore) {
    super(gameCore)

    this.states = new Map<PlayingStateType, GameState<PlayingStateType>>([
      [PlayingStateType.FALLING, new FallingState(gameCore)],
      [PlayingStateType.LOCKING, new LockingState(gameCore)],
      [PlayingStateType.CLEARING_LINES, new ClearingLinesState(gameCore)],
      [PlayingStateType.SPAWNING, new SpawningState(gameCore)],
      [PlayingStateType.LINE_CLEAR_ANIMATION, new LineClearAnimationState(gameCore)]
    ])
    
    this.currentState = this.states.get(PlayingStateType.FALLING)!
    this.currentState.enter()
  }
} 