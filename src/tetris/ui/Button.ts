import Text from './Text'
import type { TextOptions } from './Text'

type Variant = 'primary' | 'secondary'

export interface ButtonOptions {
  x: number
  y: number
  text: string
  fontSize?: number
  onClick?: () => void
  variant?: Variant
}

export default class Button {
  private x: number
  private y: number
  private width: number = 200
  private height: number = 50
  private text: Text
  private backgroundColor: string
  private borderColor: string
  private isHovered: boolean = false
  private onClick?: () => void
  private animationDuration: number = 150 // milliseconds
  private hoverStartTime: number = 0
  private currentBackgroundColor: string
  private currentBackgroundOpacity: number = 1
  private hoverOpacity: number = 0.8
  private canvas: HTMLCanvasElement | null = null
  private variant: Variant

  constructor(options: ButtonOptions) {
    this.variant = options.variant || 'primary'
    this.x = options.x
    this.y = options.y
    this.backgroundColor = COLORS[this.variant].background
    this.borderColor = COLORS[this.variant].border
    this.onClick = options.onClick
    this.currentBackgroundColor = this.backgroundColor

    const textOptions: TextOptions = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      text: options.text,
      fontSize: options.fontSize || 18,
      color: COLORS[this.variant].text,
      textAlign: 'center',
      textBaseline: 'middle',
    }

    this.text = new Text(textOptions)
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
  }

  update(deltaTime: number): void {
    void deltaTime // Intentionally unused - we use performance.now() for precise timing
    const currentTime = performance.now()

    if (this.hoverStartTime > 0) {
      const elapsed = currentTime - this.hoverStartTime
      const progress = Math.min(elapsed / this.animationDuration, 1)

      if (this.isHovered) {
        // Animate to hover state
        this.currentBackgroundOpacity = 1 - (1 - this.hoverOpacity) * this.easeOutCubic(progress)
      } else {
        // Animate back to normal state
        this.currentBackgroundOpacity =
          this.hoverOpacity + (1 - this.hoverOpacity) * this.easeOutCubic(progress)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save()

    // Draw button background with animated opacity
    ctx.globalAlpha = this.currentBackgroundOpacity
    ctx.fillStyle = this.currentBackgroundColor
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.globalAlpha = 1.0

    // Draw border with subtle glow effect on hover
    const borderAlpha = this.isHovered ? 0.8 : 0.6
    ctx.strokeStyle = this.borderColor
    ctx.globalAlpha = borderAlpha
    ctx.lineWidth = 1
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.globalAlpha = 1.0

    ctx.restore()

    // Draw text on button
    this.text.render(ctx)
  }

  handleMouseMove(mouseX: number, mouseY: number): void {
    const wasHovered = this.isHovered
    this.isHovered = this.isPointInside(mouseX, mouseY)

    // Update cursor style
    if (this.canvas) {
      if (this.isHovered) {
        this.canvas.style.cursor = 'pointer'
      } else if (wasHovered && !this.isHovered) {
        // Reset cursor when leaving button
        this.canvas.style.cursor = 'default'
      }
    }

    // Start animation when hover state changes
    if (wasHovered !== this.isHovered) {
      this.hoverStartTime = performance.now()
    }
  }

  handleMouseClick(mouseX: number, mouseY: number): void {
    if (this.isPointInside(mouseX, mouseY) && this.onClick) {
      this.onClick()
    }
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this.text.setPosition(this.x + this.width / 2, this.y + this.height / 2)
  }

  onDestroy() {
    if (this.canvas) {
      this.canvas.style.cursor = 'default'
    }
  }

  private isPointInside(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }
}

const COLORS: Record<Variant, { background: string; border: string; text: string }> = {
  primary: {
    background: '#44bec7',
    border: '#44bec7',
    text: 'white',
  },
  secondary: {
    background: 'white',
    border: '#44bec7',
    text: '#44bec7',
  },
}
