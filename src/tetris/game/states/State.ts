import type Game from '..'
import type { InputType } from '../../inputHandler'

export abstract class State {
  // private buttons: Button[] = []

  constructor(
    protected game: Game,
    protected parentState?: State
  ) {}

  abstract enter(): void
  abstract update(deltaTime: number): void
  /**
   * @description Render the state on sub canvas that is rendered later on the main canvas
   * @param ctx - The sub canvas state is rendered on
   */
  abstract render(ctx: CanvasRenderingContext2D): void
  abstract handleInput(inputs: InputType[]): void

  // TODO: fix this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleClick(_x: number, _y: number) {
    // Override in subclasses to handle click events
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseMove(_x: number, _y: number) {
    // Override in subclasses to handle mouse move events
  }

  handleMouseLeave() {
    // Override in subclasses to handle mouse leave events
  }

  // TODO: add buttons to state
  // addButton(button: Button) {
  //   this.buttons.push(button)
  // }
  // handleClick(_x: number, _y: number) {
  //   for (const button of this.buttons) {
  //     if (button.inBounds(_x, _y)) {
  //       button.handleClick()
  //     }
  //   }
  // }
}

export abstract class TetrisStateChild extends State {
  constructor(
    protected game: Game,
    protected parentState: TetrisStateWithSubstates
  ) {
    super(game, parentState)
  }
}

export abstract class TetrisStateWithSubstates extends State {
  protected substates: Record<string, State> | null = null
  protected currentSubstate: State | null = null

  setSubstate(substate: string | null) {
    if (!substate || !this.substates) {
      this.currentSubstate = null
      return
    }
    this.currentSubstate = this.substates[substate]
    this.currentSubstate.enter()
  }
}
