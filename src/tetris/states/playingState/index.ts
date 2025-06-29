import type GameCore from '../../core/gameCore'
import type { InputType } from '../../inputHandler'
import { GameStateType } from '../gameStateMachine'
import { clearCanvas, drawPlayfieldBackground, drawUI } from '../../helpers/rendering'
import State from '../state'
import { PlayingStateMachine } from './playingStateMachine'
import { Button } from '../../ui'
import config from '../../config'
import { Effect } from '../../effects/effect'

export default class PlayingState extends State<GameStateType> {
  private stateMachine: PlayingStateMachine
  private pauseButton: Button
  private effects: Effect[] = []

  constructor(gameCore: GameCore) {
    super(gameCore)
    this.stateMachine = new PlayingStateMachine(gameCore, this)

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
    this.updateEffects(deltaTime)
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
    this.renderEffects(ctx)
  }

  handleMouseMove(x: number, y: number): void {
    this.pauseButton.handleMouseMove(x, y)
  }

  handleMouseClick(x: number, y: number): void {
    this.pauseButton.handleMouseClick(x, y)
  }

  addEffect(effect: Effect) {
    this.effects.push(effect)
  }

  isGameOver(): boolean {
    const board = this.gameCore.getBoard()
    const activeTetromino = board.getActiveTetromino()
    return board.getPlayfield().hasCollision(activeTetromino)
  }

  private updateEffects(deltaTime: number) {
    this.effects = this.effects.filter((effect) => {
      effect.update(deltaTime)
      return !effect.isFinished()
    })
  }

  private renderEffects(ctx: CanvasRenderingContext2D) {
    this.effects.forEach((effect) => effect.render(ctx))
  }
}
