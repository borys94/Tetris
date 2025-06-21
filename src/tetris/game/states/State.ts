import type Game from '..'
import type { InputType } from '../../inputHandler'

export abstract class State {
  constructor(
    protected game: Game,
    protected parentState?: State
  ) {}

  abstract enter(): void
  abstract update(deltaTime: number): void
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
