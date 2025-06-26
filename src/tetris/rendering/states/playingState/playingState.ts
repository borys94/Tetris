import type GameCore from "../../../core/gameCore"
import type { InputType } from "../../../inputHandler"
import { GameStateType } from "../../gameStateMachine"
import GameState from "../gameState"
import { PlayingStateMachine } from "./playingStateMachine"

// Playing state - normal gameplay with sub-states
export default class PlayingState extends GameState<GameStateType> {
  private stateMachine: PlayingStateMachine

  constructor(gameCore: GameCore) {
    super(gameCore)
    this.stateMachine = new PlayingStateMachine(gameCore)
  }

  update(deltaTime: number): void {
    this.stateMachine.update(deltaTime)
  }

  handleInput(inputs: InputType[]): void {
    if (inputs.includes('Escape') || inputs.includes('KeyP')) {
      this.setTransition(GameStateType.PAUSED)
      return
    }

    this.stateMachine.handleInput(inputs)
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.stateMachine.render(ctx)
  }

  enter(): void {
    super.enter()
    console.log('Entering Playing State')
  }

  exit(): void {
    console.log('Exiting Playing State')
  }
}