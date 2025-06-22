import config from '../../config'
import type { InputType } from '../../inputHandler'
import Game from '..'
import { GameOverState } from '../states/board/gameOverState'
import InitState from '../states/board/initState'
import { PauseState } from '../states/board/pauseState'
import { PlayingState } from '../states/board/playingState'
import { StateWithButtons, type State } from '../states/State'
import Panel, { type ClickablePanel } from './panel'
import { ResumingGameState } from '../states/board/resumingGame'

export type TetrisStateType = 'init' | 'paused' | 'playing' | 'gameOver' | 'resumingGame'

class BoardPanel extends Panel implements ClickablePanel {
  private currentState: State | undefined
  private states: Record<TetrisStateType, State>

  constructor(game: Game) {
    super(game, config.board.width, config.board.height)

    this.states = {
      init: new InitState(game),
      paused: new PauseState(game),
      playing: new PlayingState(game),
      gameOver: new GameOverState(game),
      resumingGame: new ResumingGameState(game),
    }

    this.setState('init')
  }

  isPlaying() {
    return this.currentState === this.states.playing
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

  handleClick(x: number, y: number) {
    if (this.currentState instanceof StateWithButtons) {
      this.currentState.handleClick(x, y)
    }
  }

  handleMouseMove(x: number, y: number) {
    if (this.currentState instanceof StateWithButtons) {
      this.currentState.handleMouseMove(x, y)
    }
  }

  handleMouseLeave() {
    if (this.currentState instanceof StateWithButtons) {
      this.currentState.handleMouseLeave()
    }
  }
}

export default BoardPanel
