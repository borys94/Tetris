import type { InputType } from '../inputHandler'
import State from './state'
import { GameStateType } from './gameStateMachine'
import { Button, Text } from '../ui'
import type GameCore from '../core/gameCore'
import { clearCanvas } from '../helpers/rendering'
import config from '../config'
import { getCanvasSize } from '../helpers/canvas'
import { drawPlayfieldBackground } from '../helpers/rendering'

export default class GameOverState extends State<GameStateType> {
  private restartButton: Button
  private menuButton: Button
  private gameOverText: Text

  constructor(gameCore: GameCore) {
    super(gameCore)

    this.restartButton = new Button({
      x: 0,
      y: 0,
      text: 'Restart',
      fontSize: 24,
      onClick: () => {
        this.gameCore.reset()
        this.setTransition(GameStateType.PLAYING)
      },
    })

    this.menuButton = new Button({
      x: 0,
      y: 0,
      text: 'Menu',
      fontSize: 24,
      onClick: () => this.setTransition(GameStateType.MENU),
    })

    this.gameOverText = new Text({
      x: 0,
      y: 0,
      text: 'GAME OVER',
      fontSize: 48,
      color: 'black',
      textAlign: 'center',
      textBaseline: 'middle',
    })
  }

  update(deltaTime: number) {
    this.restartButton.update(deltaTime)
    this.menuButton.update(deltaTime)
  }

  handleInput(inputs: InputType[]) {
    if (inputs.includes('Space')) {
      this.setTransition(GameStateType.PLAYING)
    }
    if (inputs.includes('Escape')) {
      this.setTransition(GameStateType.MENU)
    }
  }

  handleMouseMove(x: number, y: number): void {
    this.restartButton.handleMouseMove(x, y)
    this.menuButton.handleMouseMove(x, y)
  }

  handleMouseClick(x: number, y: number): void {
    this.restartButton.handleMouseClick(x, y)
    this.menuButton.handleMouseClick(x, y)
  }

  render(ctx: CanvasRenderingContext2D) {
    const { width, height } = getCanvasSize(ctx.canvas)
    clearCanvas(ctx)
    drawPlayfieldBackground(ctx, width / 2 - config.board.width / 2 + config.board.margin)

    this.restartButton.setPosition(width / 2 - 100, height / 2 - 25)
    this.menuButton.setPosition(width / 2 - 100, height / 2 + 50)
    this.gameOverText.setPosition(width / 2, height / 2 - 150)

    this.restartButton.render(ctx)
    this.menuButton.render(ctx)
    this.gameOverText.render(ctx)
  }
}
