import GameCore from '../core/gameCore'
import StateMachine from './stateMachine'
import GameOverState from './gameOverState'
import type State from './state'
import MenuState from './menuState'
import PausedState from './pausedState'
import PlayingState from './playingState'

export enum GameStateType {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export class GameStateMachine extends StateMachine<GameStateType> {
  protected currentState: State<GameStateType>
  protected states: Map<GameStateType, State<GameStateType>>

  constructor(gameCore: GameCore) {
    super(gameCore)

    this.states = new Map<GameStateType, State<GameStateType>>([
      [GameStateType.MENU, new MenuState(gameCore)],
      [GameStateType.PLAYING, new PlayingState(gameCore)],
      [GameStateType.PAUSED, new PausedState(gameCore)],
      [GameStateType.GAME_OVER, new GameOverState(gameCore)],
    ])

    this.currentState = this.states.get(GameStateType.MENU)!
    this.currentState.enter()
  }
}
