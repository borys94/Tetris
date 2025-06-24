import config from '../config'
import type Board from '../game/board/board'
import imageLoader from '../imageLoader'

export const drawActiveTetromino = (ctx: CanvasRenderingContext2D, board: Board, alpha = 1) => {
  const activeTetromino = board.getActiveTetromino()
  const blocks = activeTetromino.getBlocks()
  const { brickSize } = config.board

  ctx.save()
  ctx.globalAlpha = alpha
  for (const [x, y, color] of blocks) {
    const brickImg = imageLoader.getBrickByColor(color)
    if (brickImg) {
      ctx.drawImage(
        brickImg,
        x * brickSize + config.board.margin,
        y * brickSize + config.board.margin,
        brickSize,
        brickSize
      )
    }
  }
  ctx.restore()
}

export const drawGhostTetromino = (ctx: CanvasRenderingContext2D, board: Board) => {
  const blocks = board.getGhostTetromino().getBlocks()
  const { brickSize } = config.board
  ctx.fillStyle = `rgb(204, 204, 204)`

  for (const [x, y] of blocks) {
    ctx.fillRect(
      x * brickSize + config.board.margin,
      y * brickSize + config.board.margin,
      brickSize,
      brickSize
    )
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

export const renderPlayfield = (ctx: CanvasRenderingContext2D, board: Board) => {
  const blocks = board.getPlayfield().getBlocks()
  const { brickSize } = config.board

  for (const [x, y, color] of blocks) {
    const brickImg = imageLoader.getBrickByColor(color)
    if (brickImg) {
      ctx.drawImage(
        brickImg,
        x * brickSize + config.board.margin,
        y * brickSize + config.board.margin,
        brickSize,
        brickSize
      )
    }
  }
}
