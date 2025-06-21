import config from '../../config'
import { clearCanvas } from '../../helpers/canvas'
import imageLoader from '../../imageLoader'
import type Game from '..'
import Panel from './panel'

class RightPanel extends Panel {
  constructor(game: Game) {
    super(game, config.rightPanel.width, config.rightPanel.height)
  }

  render() {
    clearCanvas(this.canvas)
    this.renderNextShapes()
    this.renderStats()
    return this.canvas
  }

  update() {}

  renderNextShapes() {
    const nextShapes = this.game.board.getNextShapes().getNextShapes()

    for (let i = 0; i < nextShapes.length; i++) {
      for (let y = 0; y < nextShapes[i].length; y++) {
        for (let x = 0; x < nextShapes[i][y].length; x++) {
          const brickImg = imageLoader.getBrickByColor(nextShapes[i][y][x])
          const brickSize = config.board.brickSize / 2
          if (nextShapes[i][y][x] !== 0 && brickImg) {
            this.ctx.drawImage(
              brickImg,
              x * brickSize,
              i * brickSize * 3 + y * brickSize,
              brickSize,
              brickSize
            )
          }
        }
      }
    }
  }

  renderStats() {
    const { height, width, margin } = config.rightPanel

    this.ctx.fillStyle = '#44bec7'
    this.ctx.font = `24px Game`

    this.ctx.textAlign = 'left'
    this.ctx.fillText(`Score`, 0, height - margin - 150)
    this.ctx.fillText(`Level`, 0, height - margin - 100)
    this.ctx.fillText(`Lines`, 0, height - margin - 50)
    this.ctx.fillText(`Time`, 0, height - margin)

    this.ctx.textAlign = 'right'
    this.ctx.fillText(`${this.game.score.score}`, width - margin, height - margin - 150)
    this.ctx.fillText(`${this.game.level.getLevel()}`, width - margin, height - margin - 100)
    this.ctx.fillText(`${this.game.level.getReducedRows()}`, width - margin, height - margin - 50)
    this.ctx.fillText(`${this.formatTime(this.game.gameTime)}`, width - margin, height - margin)
  }

  private formatTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000) % 60
    const minutes = Math.floor(milliseconds / 1000 / 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

export default RightPanel
