import GameCore from '../core/gameCore'
import config from '../config'
import imageLoader from '../imageLoader'
import { drawPlayfield, drawTetromino } from './renderers/board'

export class GameRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameCore: GameCore

  constructor(canvas: HTMLCanvasElement, gameCore: GameCore) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.gameCore = gameCore
    
    // Set canvas size
    this.canvas.width = config.board.width + config.rightPanel.width
    this.canvas.height = config.board.height
  }

  render(): void {
    // Clear canvas
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Render game board
    this.renderBoard()
    
    // Render UI
    this.renderUI()
    
    // Let the state render its specific overlay
    // currentState.render(this.ctx)
  }

  private renderBoard(): void {
    const board = this.gameCore.getBoard()
    const playfield = board.getPlayfield()
    const activeTetromino = board.getActiveTetromino()
    const ghostTetromino = board.getGhostTetromino()
    
    // Draw background
    this.ctx.fillStyle = config.board.backgroundColor
    this.ctx.fillRect(
      config.board.margin,
      config.board.margin,
      config.board.bricksX * config.board.brickSize,
      config.board.bricksY * config.board.brickSize
    )
    
    // Draw placed bricks
    drawPlayfield(this.ctx, playfield)
    
    // Draw ghost tetromino
    drawTetromino(this.ctx, ghostTetromino, true)
    
    // Draw active tetromino
    drawTetromino(this.ctx, activeTetromino, false)
  }

  private renderUI(): void {
    const uiX = config.board.width + config.board.margin
    const uiY = config.board.margin
    
    // Background for UI panel
    this.ctx.fillStyle = '#f0f0f0'
    this.ctx.fillRect(uiX, uiY, config.rightPanel.width - config.board.margin, config.rightPanel.height - config.board.margin)
    
    // Score
    this.ctx.fillStyle = 'black'
    this.ctx.font = '24px Arial'
    this.ctx.textAlign = 'left'
    this.ctx.fillText('Score:', uiX + 10, uiY + 30)
    this.ctx.fillText(this.gameCore.getScoring().getScore().toString(), uiX + 10, uiY + 60)
    
    // Level
    this.ctx.fillText('Level:', uiX + 10, uiY + 100)
    this.ctx.fillText(this.gameCore.getLevel().getLevel().toString(), uiX + 10, uiY + 130)
    
    // Lines cleared
    this.ctx.fillText('Lines:', uiX + 10, uiY + 170)
    this.ctx.fillText(this.gameCore.getLevel().getClearedLines().toString(), uiX + 10, uiY + 200)
    
    // Next piece preview
    this.ctx.fillText('Next:', uiX + 10, uiY + 240)
    this.renderNextPiece(uiX + 10, uiY + 270)
  }

  private renderNextPiece(x: number, y: number): void {
    const queue = this.gameCore.getBoard().getTetrominoQueue()
    if (queue.length > 0) {
      const nextTetromino = queue[0]
      const blocks = nextTetromino.getBlocks()
      const color = nextTetromino.getColor()
      
      for (const [blockX, blockY] of blocks) {
        this.ctx.drawImage(
          imageLoader.getBrickByColor(color) || new Image(),
          x + blockX * 20,
          y + blockY * 20,
          20,
          20
        )
      }
    }
  }
} 