import type Game from '..'
import type { InputType } from '../../inputHandler'
import type Button from '../components/button'
import type { Effect } from '../effects/effect'

export abstract class State {
  protected disableParentUpdate = false // TODO: rename - forceUpdate?
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

  isParentUpdateDisabled() {
    return this.disableParentUpdate
  }
}

export abstract class ChildState extends State {
  protected parentState: ParentState

  constructor(
    protected game: Game,
    parentState: ParentState
  ) {
    super(game, parentState)
    this.parentState = parentState
  }
}

export abstract class ParentState extends State {
  protected effects: Effect[] = []

  protected abstract substates: Record<string, State>
  protected abstract currentSubstate: State | null

  constructor(game: Game, parentState?: State) {
    super(game, parentState)
  }

  setSubstate(substate: string | null) {
    if (!substate || !this.substates) {
      this.currentSubstate = null
      return
    }
    this.currentSubstate = this.substates[substate]
    this.currentSubstate.enter()
  }

  addEffect(effect: Effect) {
    this.effects.push(effect)
  }

  updateEffects(deltaTime: number) {
    this.effects = this.effects.filter((effect) => {
      effect.update(deltaTime)
      return !effect.isFinished()
    })
  }

  renderEffects(ctx: CanvasRenderingContext2D) {
    for (const effect of this.effects) {
      effect.render(ctx)
    }
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
