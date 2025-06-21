import config from '../../config'
import type { InputType } from '../../inputHandler'
import Game from '..'
import { GameOverState } from '../states/board/GameOverState'
import InitState from '../states/board/initState'
import { PauseState } from '../states/board/PauseState'
import { PlayingState } from '../states/board/PlayingState'
import type { State } from '../states/State'
import Panel from './panel'

export type TetrisStateType = 'init' | 'paused' | 'playing' | 'gameOver'

class BoardPanel extends Panel {
  private currentState: State | undefined
  private states: Record<TetrisStateType, State>

  constructor(game: Game) {
    super(game, config.board.width, config.board.height)

    this.states = {
      init: new InitState(game),
      paused: new PauseState(game),
      playing: new PlayingState(game),
      gameOver: new GameOverState(game),
    }

    this.setState('init')
  }

  setState(state: TetrisStateType) {
    this.currentState = this.states[state]
    this.currentState.enter()
  }

  render() {
    this.currentState?.render(this.ctx)
    return this.canvas
  }

  update(deltaTime: number) {
    this.currentState?.update(deltaTime)
  }

  handleInput(input: InputType[]) {
    this.currentState?.handleInput(input)
  }
}

export default BoardPanel
