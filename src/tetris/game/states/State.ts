import type Game from '..'
import type { InputType } from '../../inputHandler'
import type Button from '../components/button'

export abstract class State {
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

export abstract class StateWithButtons extends State {
  private buttons: Button[] = []

  constructor(game: Game, parentState?: State) {
    super(game, parentState)
  }

  update(deltaTime: number) {
    for (const button of this.buttons) {
      button.update(deltaTime)
    }
  }

  renderButtons(ctx: CanvasRenderingContext2D) {
    for (const button of this.buttons) {
      button.render(ctx)
    }
  }

  addButton(button: Button) {
    this.buttons.push(button)
  }

  handleMouseMove(x: number, y: number) {
    for (const button of this.buttons) {
      if (button.inBounds(x, y)) {
        button.hover()
      } else {
        button.unhover()
      }
    }
  }

  handleMouseLeave() {
    // Override in subclasses to handle mouse leave events
  }

  handleClick(x: number, y: number) {
    for (const button of this.buttons) {
      if (button.inBounds(x, y)) {
        button.handleClick()
      }
    }
  }
}
