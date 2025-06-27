import type { InputType } from '../inputHandler'
import State from './state'
import { GameStateType } from './gameStateMachine'
import type GameCore from '../core/gameCore'
import Button from '../ui/Button'
import { clearCanvas, drawPlayfieldBackground } from '../helpers/rendering'
import { getCanvasSize } from '../helpers/canvas'
import config from '../config'
import Text from '../ui/Text'

export default class PausedState extends State<GameStateType> {
  private canUnpause = false
  private startButton: Button
  private resumeButton: Button
  private pausedText: Text

  constructor(gameCore: GameCore) {
    super(gameCore)

    this.pausedText = new Text({
      x: 0,
      y: 0,
      text: 'PAUSED',
      fontSize: 48,
      color: 'black',
      textAlign: 'center',
      textBaseline: 'middle',
    })

    this.startButton = new Button({
      x: 0,
      y: 0,
      text: 'New game',
      fontSize: 24,
      onClick: () => this.setTransition(GameStateType.PLAYING),
    })

    this.resumeButton = new Button({
      x: 0,
      y: 0,
      text: 'Resume',
      variant: 'secondary',
      fontSize: 24,
      onClick: () => this.setTransition(GameStateType.PLAYING),
    })
  }

  update(deltaTime: number): void {
    this.startButton.update(deltaTime)
    this.resumeButton.update(deltaTime)
  }

  handleInput(inputs: InputType[]): void {
    if (!inputs.includes('KeyP') && !inputs.includes('Escape')) {
      this.canUnpause = true
    }

    if (this.canUnpause && (inputs.includes('KeyP') || inputs.includes('Escape'))) {
      this.setTransition(GameStateType.PLAYING)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = getCanvasSize(ctx.canvas)
    clearCanvas(ctx)
    drawPlayfieldBackground(
      ctx,
      width / 2 - config.board.width / 2 + config.board.margin,
      config.board.margin
    )
    this.startButton.setPosition(width / 2 - 100, height / 2 - 25)
    this.resumeButton.setPosition(width / 2 - 100, height / 2 + 50)
    this.pausedText.setPosition(width / 2, height / 2 - 150)
    this.pausedText.render(ctx)
    this.startButton.render(ctx)
    this.resumeButton.render(ctx)
  }

  handleMouseMove(x: number, y: number): void {
    this.startButton.handleMouseMove(x, y)
    this.resumeButton.handleMouseMove(x, y)
  }

  handleMouseClick(x: number, y: number): void {
    this.startButton.handleMouseClick(x, y)
    this.resumeButton.handleMouseClick(x, y)
  }

  enter(): void {
    super.enter()
    this.canUnpause = false
  }
}
