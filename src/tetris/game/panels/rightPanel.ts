import config from '../../config'
import { clearCanvas } from '../../helpers/canvas'
import imageLoader from '../../imageLoader'
import type Game from '..'
import Panel, { type ClickablePanel } from './panel'
import Button from '../components/button'

class RightPanel extends Panel implements ClickablePanel {
  private pauseButton: Button

  constructor(game: Game) {
    super(game, config.rightPanel.width, config.rightPanel.height)

    this.pauseButton = new Button(
      'Pause',
      'primary',
      0,
      config.rightPanel.height - config.rightPanel.margin - 50,
      config.rightPanel.width - config.rightPanel.margin,
      50
    )

    this.pauseButton.onClick(() => {
      this.game.setBoardPanelState('paused')
    })
  }

  render() {
    clearCanvas(this.canvas)
    this.renderNextShapes()
    this.renderStats()
    this.pauseButton.render(this.ctx)
    return this.canvas
  }

  update(deltaTime: number) {
    if (this.game.isPlaying()) {
      this.pauseButton.setHidden(false)
    } else {
      this.pauseButton.setHidden(true)
    }
    this.pauseButton.update(deltaTime)
  }

  renderNextShapes() {
    const tetrominoQueue = this.game.board.getTetrominoQueue()

    for (let i = 0; i < tetrominoQueue.length; i++) {
      const tetromino = tetrominoQueue[i]
      const blocks = tetromino.getBlocks()

      blocks.forEach(([x, y, color]) => {
        const brickImg = imageLoader.getBrickByColor(color)
        const brickSize = config.board.brickSize / 2
        if (brickImg) {
          this.ctx.drawImage(
            brickImg,
            x * brickSize,
            i * brickSize * 3 + y * brickSize,
            brickSize,
            brickSize
          )
        }
      })

      // for (let y = 0; y < blocks.length; y++) {
      //   for (let x = 0; x < blocks[y].length; x++) {
      //     const brickImg = imageLoader.getBrickByColor(blocks[y][x])
      //     const brickSize = config.board.brickSize / 2
      //     if (blocks[y][x] !== 0 && brickImg) {
      //       this.ctx.drawImage(
      //         brickImg,
      //         x * brickSize,
      //         i * brickSize * 3 + y * brickSize,
      //         brickSize,
      //         brickSize
      //       )
      //     }
      //   }
      // }
    }
  }

  renderStats() {
    const { height, width, margin } = config.rightPanel

    this.ctx.fillStyle = '#44bec7'
    this.ctx.font = `24px Game`

    this.ctx.textAlign = 'left'
    this.ctx.fillText(`Score`, 0, height - margin - 250)
    this.ctx.fillText(`Level`, 0, height - margin - 200)
    this.ctx.fillText(`Lines`, 0, height - margin - 150)
    this.ctx.fillText(`Time`, 0, height - margin - 100)

    this.ctx.textAlign = 'right'
    this.ctx.fillText(`${this.game.score.score}`, width - margin, height - margin - 250)
    this.ctx.fillText(`${this.game.level.getLevel()}`, width - margin, height - margin - 200)
    this.ctx.fillText(`${this.game.level.getClearedLines()}`, width - margin, height - margin - 150)
    this.ctx.fillText(
      `${this.formatTime(this.game.gameTime)}`,
      width - margin,
      height - margin - 100
    )
  }

  private formatTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000) % 60
    const minutes = Math.floor(milliseconds / 1000 / 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  handleClick(x: number, y: number) {
    if (this.pauseButton.inBounds(x, y)) {
      this.pauseButton.handleClick()
    }
  }

  handleMouseMove(x: number, y: number) {
    if (this.pauseButton.inBounds(x, y)) {
      this.pauseButton.hover()
    } else {
      this.pauseButton.unhover()
    }
  }
}

export default RightPanel
