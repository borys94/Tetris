const INPUTS = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Space',
  'Escape',
  'KeyP',
  'KeyZ', // rotate left
] as const

export type InputType = (typeof INPUTS)[number]

export interface MousePosition {
  x: number
  y: number
}

export interface MouseEvent {
  type: 'move' | 'click'
  position: MousePosition
}

class InputHandler {
  private activeKeys: InputType[] = []
  private mousePosition: MousePosition = { x: 0, y: 0 }
  private mouseClickCallbacks: ((event: MouseEvent) => void)[] = []
  private mouseMoveCallbacks: ((event: MouseEvent) => void)[] = []

  constructor(canvas: HTMLCanvasElement) {
    window.addEventListener('keydown', (e) => {
      e.preventDefault()
      if (this.hasInput(e.code)) {
        this.activeKeys.push(e.code)
      }
    })

    window.addEventListener('keyup', (e) => {
      e.preventDefault()
      if (this.hasInput(e.code)) {
        this.activeKeys = this.activeKeys.filter((key) => key != e.code)
      }
    })

    // Mouse event listeners
    canvas.addEventListener('mousemove', (e) => {
      this.mousePosition = { x: e.clientX, y: e.clientY }
      const event: MouseEvent = { type: 'move', position: this.mousePosition }
      this.mouseMoveCallbacks.forEach((callback) => callback(event))
    })

    canvas.addEventListener('click', (e) => {
      this.mousePosition = { x: e.clientX, y: e.clientY }
      const event: MouseEvent = { type: 'click', position: this.mousePosition }
      this.mouseClickCallbacks.forEach((callback) => callback(event))
    })
  }

  getActiveKeys() {
    return this.activeKeys
  }

  getMousePosition(): MousePosition {
    return this.mousePosition
  }

  onMouseClick(callback: (event: MouseEvent) => void): void {
    this.mouseClickCallbacks.push(callback)
  }

  onMouseMove(callback: (event: MouseEvent) => void): void {
    this.mouseMoveCallbacks.push(callback)
  }

  private hasInput(code: string): code is InputType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return INPUTS.includes(code as any)
  }
}

export default InputHandler
