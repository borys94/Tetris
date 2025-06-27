import GameCore from '../core/gameCore'
import type { InputType } from '../inputHandler'
import type State from './state'

export default abstract class StateMachine<StateType extends string> {
  protected abstract currentState: State<StateType>
  protected abstract states: Map<StateType, State<StateType>>
  protected gameCore: GameCore
  protected canHandleInput: boolean = false

  constructor(gameCore: GameCore) {
    this.gameCore = gameCore
  }

  update(deltaTime: number): void {
    this.currentState.update(deltaTime)

    const nextStateType = this.currentState.getTransition()
    if (nextStateType) {
      this.changeState(nextStateType)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.currentState.render(ctx)
  }

  handleInput(inputs: InputType[]): void {
    if (!inputs.length && !this.canHandleInput) {
      this.canHandleInput = true
    }

    if (!this.canHandleInput) {
      return
    }

    this.currentState.handleInput(inputs)
  }

  handleMouseMove(x: number, y: number): void {
    this.currentState.handleMouseMove(x, y)
  }

  handleMouseClick(x: number, y: number): void {
    this.currentState.handleMouseClick(x, y)
  }

  protected changeState(newStateType: StateType): void {
    const newState = this.states.get(newStateType)
    if (!newState) {
      throw new Error(`State ${newStateType} not found`)
    }

    console.log('Exiting state', this.getCurrentStateType())
    this.currentState.exit()
    this.currentState = newState
    console.log('Entering state', this.getCurrentStateType())
    this.currentState.enter()
    this.canHandleInput = false
  }

  getCurrentStateType(): StateType {
    for (const [stateType, state] of this.states) {
      if (state === this.currentState) {
        return stateType
      }
    }
    throw new Error('Current state not found in states map')
  }

  getCurrentState(): State<StateType> {
    return this.currentState
  }
}
