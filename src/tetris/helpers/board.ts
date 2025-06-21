import config from '../config'

export const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = config.board.backgroundColor
  ctx.fillRect(
    config.board.margin,
    config.board.margin,
    config.board.width - config.board.margin * 2,
    config.board.height - config.board.margin * 2
  )
}
