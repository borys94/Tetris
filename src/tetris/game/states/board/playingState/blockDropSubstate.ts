import type { InputType } from '../../../../inputHandler'
import { ChildState } from '../../State'

/**
 * @description
 * It is used to prevent the player from performing a soft drop or hard drop
 * immediately after the tetromino is dropped, so double drop is not possible.
 */
export class BlockDropSubstate extends ChildState {
  enter() {}

  update() {}

  render() {}

  handleInput(inputs: InputType[]) {
    if (!inputs.includes('ArrowDown') && !inputs.includes('Space')) {
      this.parentState.setSubstate(null)
    }
  }
}
