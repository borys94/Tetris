import type GameCore from '../../core/gameCore'
import FallingState from './fallingState'
import LockingState from './lockingState'
import ClearingLinesState from './clearingLinesState'
import type State from '../state'
import StateMachine from '../stateMachine'

export enum PlayingStateType {
  FALLING = 'FALLING',
  CLEARING_LINES = 'CLEARING_LINES',
  LOCKING = 'LOCKING',
}

export class PlayingStateMachine extends StateMachine<PlayingStateType> {
  protected currentState: State<PlayingStateType>
  protected states: Map<PlayingStateType, State<PlayingStateType>>

  constructor(gameCore: GameCore) {
    super(gameCore)

    this.states = new Map<PlayingStateType, State<PlayingStateType>>([
      [PlayingStateType.FALLING, new FallingState(gameCore)],
      [PlayingStateType.LOCKING, new LockingState(gameCore)],
      [PlayingStateType.CLEARING_LINES, new ClearingLinesState(gameCore)],
    ])

    this.currentState = this.states.get(PlayingStateType.FALLING)!
    this.currentState.enter()
  }
}
