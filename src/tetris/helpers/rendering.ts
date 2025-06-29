import config from '../config'
import type Playfield from '../core/board/playfield'
import type ActiveTetromino from '../core/board/tetrominos/activeTetromino'
import type GameCore from '../core/gameCore'
import imageLoader from '../imageLoader'

export const drawPlayfield = (ctx: CanvasRenderingContext2D, playfield: Playfield) => {
  const blocks = playfield.getBlocks()

  for (const [x, y, color] of blocks) {
    drawBrick(ctx, x, y, color)
  }
}

export const drawTetromino = (
  ctx: CanvasRenderingContext2D,
  tetromino: ActiveTetromino | null,
  isGhost: boolean
) => {
  if (!tetromino) return

  const blocks = tetromino.getBlocks()

  for (const [x, y, color] of blocks) {
    if (isGhost) {
      drawGhostBrick(ctx, x, y, color)
    } else {
      drawBrick(ctx, x, y, color)
    }
  }
}

export const drawPlayfieldBackground = (
  ctx: CanvasRenderingContext2D,
  x: number = config.board.margin,
  y: number = config.board.margin
) => {
  ctx.clearRect(x, y, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = config.board.backgroundColor
  ctx.fillRect(
    x,
    y,
    config.board.width - config.board.margin * 2,
    config.board.height - config.board.margin * 2
  )
}

export const drawUI = (ctx: CanvasRenderingContext2D, gameCore: GameCore) => {
  renderNextShapes(ctx, gameCore)
  renderHeldTetromino(ctx, gameCore)
  renderStats(ctx, gameCore)
}

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  const ratio = window.devicePixelRatio
  const canvasWidth = ctx.canvas.width / ratio
  const canvasHeight = ctx.canvas.height / ratio

  ctx.save()
  ctx.fillStyle = '#fafafa'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.restore()
}

const renderNextShapes = (ctx: CanvasRenderingContext2D, gameCore: GameCore) => {
  const tetrominoQueue = gameCore.getBoard().getTetrominoQueue()
  const boardWidth = config.board.width

  for (let i = 0; i < tetrominoQueue.length; i++) {
    const tetromino = tetrominoQueue[i]
    const blocks = tetromino.getBlocks()

    blocks.forEach(([x, y, color]) => {
      const brickImg = imageLoader.getBrickByColor(color)
      const brickSize = config.board.brickSize / 2
      if (brickImg) {
        ctx.drawImage(
          brickImg,
          boardWidth + x * brickSize,
          i * brickSize * 3 + y * brickSize,
          brickSize,
          brickSize
        )
      }
    })
  }
}

const renderStats = (ctx: CanvasRenderingContext2D, gameCore: GameCore) => {
  const { height, width, margin } = config.rightPanel
  const boardWidth = config.board.width

  ctx.fillStyle = '#44bec7'
  ctx.font = `24px Game`

  ctx.textAlign = 'left'
  ctx.fillText(`Score`, boardWidth + margin, height - margin - 250)
  ctx.fillText(`Level`, boardWidth + margin, height - margin - 200)
  ctx.fillText(`Lines`, boardWidth + margin, height - margin - 150)
  ctx.fillText(`Combo`, boardWidth + margin, height - margin - 100)
  ctx.fillText(`B2B`, boardWidth + margin, height - margin - 50)
  // ctx.fillText(`Time`, boardWidth + margin, height - margin)

  ctx.textAlign = 'right'
  ctx.fillText(
    `${gameCore.getScoring().getScore()}`,
    boardWidth + width - margin,
    height - margin - 250
  )
  ctx.fillText(
    `${gameCore.getLevel().getLevel()}`,
    boardWidth + width - margin,
    height - margin - 200
  )
  ctx.fillText(
    `${gameCore.getLevel().getClearedLines()}`,
    boardWidth + width - margin,
    height - margin - 150
  )
  ctx.fillText(
    `${gameCore.getScoring().getCombo()}`,
    boardWidth + width - margin,
    height - margin - 100
  )
  ctx.fillText(
    gameCore.getScoring().isBackToBack() ? 'YES' : 'NO',
    boardWidth + width - margin,
    height - margin - 50
  )
  // ctx.fillText(
  //   `${this.formatTime(this.game.gameTime)}`,
  //   width - margin,
  //   height - margin
  // )
}

// const formatTime = (milliseconds: number) => {
//   const seconds = Math.floor(milliseconds / 1000) % 60
//   const minutes = Math.floor(milliseconds / 1000 / 60)
//   return `${minutes}:${seconds.toString().padStart(2, '0')}`
// }

const drawGhostBrick = (ctx: CanvasRenderingContext2D, x: number, y: number, color: number) => {
  ctx.globalAlpha = 0.3
  drawBrick(ctx, x, y, color)
  ctx.globalAlpha = 1.0
}

const drawBrick = (ctx: CanvasRenderingContext2D, x: number, y: number, color: number) => {
  if (y < 0) {
    return
  }
  const image = imageLoader.getBrickByColor(color)
  if (image) {
    ctx.drawImage(
      image,
      config.board.margin + x * config.board.brickSize,
      config.board.margin + y * config.board.brickSize,
      config.board.brickSize,
      config.board.brickSize
    )
  } else {
    // Fallback to colored rectangle
    const colors = ['#0000FF', '#FFFF00', '#00FFFF', '#FF0000', '#800080']
    ctx.fillStyle = colors[color - 1] || '#000000'
    ctx.fillRect(
      config.board.margin + x * config.board.brickSize,
      config.board.margin + y * config.board.brickSize,
      config.board.brickSize,
      config.board.brickSize
    )
  }
}

const renderHeldTetromino = (ctx: CanvasRenderingContext2D, gameCore: GameCore) => {
  const heldTetromino = gameCore.getBoard().getHeldTetromino()
  const canHold = gameCore.getBoard().canHoldTetromino()
  const boardWidth = config.board.width
  const brickSize = config.board.brickSize / 2

  // Draw "HOLD" label
  ctx.fillStyle = '#44bec7'
  ctx.font = `16px Game`
  ctx.textAlign = 'left'
  ctx.fillText('HOLD', boardWidth + 10, 230)

  if (heldTetromino) {
    const blocks = heldTetromino.getBlocks()

    // Center the tetromino in the hold area
    const minX = Math.min(...blocks.map(([x]) => x))
    const maxX = Math.max(...blocks.map(([x]) => x))
    const minY = Math.min(...blocks.map(([, y]) => y))
    const maxY = Math.max(...blocks.map(([, y]) => y))

    const offsetX = (4 - (maxX - minX + 1)) / 2
    const offsetY = (4 - (maxY - minY + 1)) / 2

    // Make held tetromino semi-transparent if can't hold
    if (!canHold) {
      ctx.globalAlpha = 0.5
    }

    blocks.forEach(([x, y, color]) => {
      const brickImg = imageLoader.getBrickByColor(color)
      if (brickImg) {
        ctx.drawImage(
          brickImg,
          boardWidth + (x - minX + offsetX) * brickSize,
          (y - minY + offsetY) * brickSize + 230,
          brickSize,
          brickSize
        )
      }
    })

    // Reset alpha
    if (!canHold) {
      ctx.globalAlpha = 1.0
    }
  }
}
