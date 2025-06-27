export interface TextOptions {
  x: number
  y: number
  text: string
  font?: string
  fontSize?: number
  color?: string
  textAlign?: CanvasTextAlign
  textBaseline?: CanvasTextBaseline
}

export default class Text {
  private x: number
  private y: number
  private text: string
  private font: string
  private fontSize: number
  private color: string
  private textAlign: CanvasTextAlign
  private textBaseline: CanvasTextBaseline

  constructor(options: TextOptions) {
    this.x = options.x
    this.y = options.y
    this.text = options.text
    this.font = options.font || 'Game'
    this.fontSize = options.fontSize || 16
    this.color = options.color || 'white'
    this.textAlign = options.textAlign || 'left'
    this.textBaseline = options.textBaseline || 'top'
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.fillStyle = this.color
    ctx.font = `${this.fontSize}px ${this.font}`
    ctx.textAlign = this.textAlign
    ctx.textBaseline = this.textBaseline
    ctx.fillText(this.text, this.x, this.y)
    ctx.restore()
  }

  setText(text: string): void {
    this.text = text
  }

  setColor(color: string): void {
    this.color = color
  }

  setFontSize(size: number): void {
    this.fontSize = size
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}
