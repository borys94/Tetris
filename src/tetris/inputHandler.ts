const INPUTS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Space', 'Escape', 'KeyP'] as const

export type InputType = (typeof INPUTS)[number]

class InputHandler {
  private activeKeys: InputType[] = []

  constructor() {
    window.addEventListener('keydown', (e) => {
      e.preventDefault()
      if (this.hasInput(e.code)) {
        this.activeKeys.push(e.code)
      }
    })

    window.addEventListener('keyup', (e) => {
      e.preventDefault()
      if (this.hasInput(e.code)) {
        this.activeKeys = this.activeKeys.filter(key => key != e.code)
      }
    })
  }

  getActiveKeys() {
    return this.activeKeys
  }

  private hasInput(code: string): code is InputType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return INPUTS.includes(code as any)
  }
}

export default InputHandler
