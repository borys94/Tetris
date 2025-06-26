import config from '../../config'
import type Playfield from '../../core/board/playfield'
import type ActiveTetromino from '../../core/board/tetrominos/activeTetromino'

import imageLoader from '../../imageLoader'

export const drawPlayfield = (ctx: CanvasRenderingContext2D, playfield: Playfield) => {
  const blocks = playfield.getBlocks()
  
  for (const [x, y, color] of blocks) {
    drawBrick(ctx, x, y, color)
  }
}

export const drawTetromino = (ctx: CanvasRenderingContext2D, tetromino: ActiveTetromino | null, isGhost: boolean) => {
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

export const drawPlayfieldBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = config.board.backgroundColor
  ctx.fillRect(
    config.board.margin,
    config.board.margin,
    config.board.width - config.board.margin * 2,
    config.board.height - config.board.margin * 2
  )
}

const drawGhostBrick = (ctx: CanvasRenderingContext2D, x: number, y: number, color: number) => {
  ctx.globalAlpha = 0.3
  drawBrick(ctx, x, y, color)
  ctx.globalAlpha = 1.0
}

const drawBrick = (ctx: CanvasRenderingContext2D, x: number, y: number, color: number) => {
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
