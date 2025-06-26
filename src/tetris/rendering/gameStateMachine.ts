import GameCore from '../core/gameCore'
import StateMachine from './stateMachine'
import GameOverState from './states/gameOverState'
import type GameState from './states/gameState'
import MenuState from './states/menuState'
import PausedState from './states/pausedState'
import PlayingState from './states/playingState/playingState'

export enum GameStateType {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export class GameStateMachine extends StateMachine<GameStateType> {
  protected currentState: GameState<GameStateType>
  protected states: Map<GameStateType, GameState<GameStateType>>
  
  constructor(gameCore: GameCore) {
    super(gameCore)

    this.states = new Map<GameStateType, GameState<GameStateType>>([
      [GameStateType.MENU, new MenuState(gameCore)],
      [GameStateType.PLAYING, new PlayingState(gameCore)],
      [GameStateType.PAUSED, new PausedState(gameCore)],
      [GameStateType.GAME_OVER, new GameOverState(gameCore)],
    ])

    this.currentState = this.states.get(GameStateType.MENU)!
    this.currentState.enter()
  }
}
