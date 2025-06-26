import type GameCore from '../../core/gameCore'
import type { InputType } from '../../inputHandler'
import { GameStateType } from '../gameStateMachine'
import { drawPlayfieldBackground, drawUI } from '../../helpers/rendering'
import State from '../state'
import { PlayingStateMachine } from './playingStateMachine'

export default class PlayingState extends State<GameStateType> {
  private stateMachine: PlayingStateMachine

  constructor(gameCore: GameCore) {
    super(gameCore)
    this.stateMachine = new PlayingStateMachine(gameCore)
  }

  update(deltaTime: number): void {
    if (this.isGameOver()) {
      this.setTransition(GameStateType.GAME_OVER)
      return
    }

    this.stateMachine.update(deltaTime)
  }

  handleInput(inputs: InputType[]): void {
    if (inputs.includes('Escape') || inputs.includes('KeyP')) {
      this.setTransition(GameStateType.PAUSED)
      return
    }

    this.stateMachine.handleInput(inputs)
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawPlayfieldBackground(ctx)
    drawUI(ctx, this.gameCore)
    this.stateMachine.render(ctx)
  }

  enter(): void {
    super.enter()
    console.log('Entering Playing State')
  }

  exit(): void {
    console.log('Exiting Playing State')
  }

  isGameOver(): boolean {
    const board = this.gameCore.getBoard()
    const activeTetromino = board.getActiveTetromino()
    return board.getPlayfield().hasCollision(activeTetromino)
  }
}
