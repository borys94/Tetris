import State from './state'
import { GameStateType } from './gameStateMachine'
import type { InputType } from '../inputHandler'
import type GameCore from '../core/gameCore'
import Button from '../ui/Button'
import Text from '../ui/Text'
import { drawPlayfieldBackground } from '../helpers/rendering'
import config from '../config'

export default class MenuState extends State<GameStateType> {
  private startButton: Button
  private exitButton: Button
  private titleText: Text
  private canvasWidth: number = 0
  private canvasHeight: number = 0
  private canvas: HTMLCanvasElement | null = null

  constructor(gameCore: GameCore) {
    super(gameCore)

    // Initialize with default values, will be updated in render
    this.titleText = new Text({
      x: 0,
      y: 0,
      text: 'TETRIS',
      fontSize: 64,
      color: 'black',
      textAlign: 'center',
      textBaseline: 'top',
    })

    this.startButton = new Button({
      x: 0,
      y: 0,
      text: 'Start',
      fontSize: 24,
      onClick: () => this.setTransition(GameStateType.PLAYING),
    })

    this.exitButton = new Button({
      x: 0,
      y: 0,
      text: 'Exit',
      variant: 'secondary',
      fontSize: 24,
      // onClick: () => {
      //   // Exit game - handled by state machine
      //   window.close()
      // },
    })
  }

  update(deltaTime: number): void {
    this.startButton.update(deltaTime)
    this.exitButton.update(deltaTime)
  }

  handleInput(inputs: InputType[]): void {
    // Keep keyboard support for accessibility
    if (inputs.includes('Space')) {
      this.setTransition(GameStateType.PLAYING)
    }
    if (inputs.includes('Escape')) {
      // Exit game - handled by state machine
    }
  }

  handleMouseMove(x: number, y: number): void {
    this.startButton.handleMouseMove(x, y)
    this.exitButton.handleMouseMove(x, y)
  }

  handleMouseClick(x: number, y: number): void {
    this.startButton.handleMouseClick(x, y)
    this.exitButton.handleMouseClick(x, y)
  }

  private updatePositions(canvasWidth: number, canvasHeight: number): void {
    if (this.canvasWidth === canvasWidth && this.canvasHeight === canvasHeight) {
      return // No need to update if canvas size hasn't changed
    }

    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    // Update title position
    this.titleText.setPosition(canvasWidth / 2, canvasHeight / 2 - 150)

    // Update button positions
    this.startButton.setPosition(canvasWidth / 2 - 100, canvasHeight / 2 - 25)
    this.exitButton.setPosition(canvasWidth / 2 - 100, canvasHeight / 2 + 50)

    // Set canvas reference for cursor handling
    if (this.canvas) {
      this.startButton.setCanvas(this.canvas)
      this.exitButton.setCanvas(this.canvas)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Store canvas reference for cursor handling
    this.canvas = ctx.canvas

    const ratio = window.devicePixelRatio
    const canvasWidth = ctx.canvas.width / ratio
    const canvasHeight = ctx.canvas.height / ratio

    // Update positions if canvas size changed
    this.updatePositions(canvasWidth, canvasHeight)
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Clear canvas
    drawPlayfieldBackground(ctx, canvasWidth / 2 - config.board.width / 2 + config.board.margin)

    // Render title
    this.titleText.render(ctx)

    // Render buttons
    this.startButton.render(ctx)
    this.exitButton.render(ctx)
  }

  exit(): void {
    this.startButton.onDestroy()
    this.exitButton.onDestroy()
  }
}
