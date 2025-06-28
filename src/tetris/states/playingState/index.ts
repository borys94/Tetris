import type GameCore from '../../core/gameCore'
import type { InputType } from '../../inputHandler'
import { GameStateType } from '../gameStateMachine'
import { clearCanvas, drawPlayfieldBackground, drawUI } from '../../helpers/rendering'
import State from '../state'
import { PlayingStateMachine } from './playingStateMachine'
import { Button } from '../../ui'
import config from '../../config'

export default class PlayingState extends State<GameStateType> {
  private stateMachine: PlayingStateMachine
  private pauseButton: Button

  constructor(gameCore: GameCore) {
    super(gameCore)
    this.stateMachine = new PlayingStateMachine(gameCore)

    this.pauseButton = new Button({
      x: config.board.width + config.rightPanel.margin,
      y: config.board.height - config.rightPanel.margin - 50,
      text: 'Pause',
      fontSize: 24,
      onClick: () => this.setTransition(GameStateType.PAUSED),
    })
  }

  update(deltaTime: number): void {
    // if (this.isGameOver()) {
    //   this.setTransition(GameStateType.GAME_OVER)
    //   return
    // }

    this.pauseButton.update(deltaTime)
    this.stateMachine.update(deltaTime)
    this.gameCore.updateEffects(deltaTime)
  }

  handleInput(inputs: InputType[]): void {
    if (inputs.includes('Escape') || inputs.includes('KeyP')) {
      this.setTransition(GameStateType.PAUSED)
      return
    }

    this.stateMachine.handleInput(inputs)
  }

  render(ctx: CanvasRenderingContext2D): void {
    clearCanvas(ctx)
    drawPlayfieldBackground(ctx)
    drawUI(ctx, this.gameCore)
    this.pauseButton.render(ctx)
    this.stateMachine.render(ctx)
    this.gameCore.renderEffects(ctx)
  }

  handleMouseMove(x: number, y: number): void {
    this.pauseButton.handleMouseMove(x, y)
  }

  handleMouseClick(x: number, y: number): void {
    this.pauseButton.handleMouseClick(x, y)
  }

  isGameOver(): boolean {
    const board = this.gameCore.getBoard()
    const activeTetromino = board.getActiveTetromino()
    return board.getPlayfield().hasCollision(activeTetromino)
  }
}
