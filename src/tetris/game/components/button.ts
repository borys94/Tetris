// TODO: add secondary variant
type Variant = 'primary'

const colors: Record<Variant, string> = {
  primary: '#44bec7',
}

const MIN_OPACITY = 0.75

class Button {
  private text: string
  private fillColor: string
  private textColor: string

  private x: number
  private y: number

  private width: number
  private height: number

  private opacity = 1

  private hovered = false
  private hoverDuration = 150
  private hoverElapsed = 0

  constructor(text: string, variant: Variant, x: number, y: number, width: number, height: number) {
    this.text = text
    this.fillColor = colors[variant]
    this.textColor = 'white'
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  inBounds(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height
  }

  // TODO: add opacity animation when unhovered
  update(deltaTime: number) {
    this.opacity = Math.max(
      1 - this.hoverElapsed / this.hoverDuration * (1 - MIN_OPACITY),
      MIN_OPACITY
    )

    if (!this.hovered) {
      this.opacity = 1
    }
    this.hoverElapsed += deltaTime
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.fillColor
    ctx.globalAlpha = this.opacity
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.globalAlpha = 1

    ctx.fillStyle = this.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '25px Game'
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2, this.width)
  }

  hover() {
    if (this.hovered) {
      return
    }

    this.hoverElapsed = 0
    this.hovered = true
  }

  unhover() {
    if (!this.hovered) {
      return
    }

    this.hoverElapsed = 0
    this.hovered = false
  }

  handleClick() {
    console.log('clicked')
  }
}

export default Button
