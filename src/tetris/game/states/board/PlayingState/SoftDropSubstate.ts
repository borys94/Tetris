import type { InputType } from '../../../../inputHandler'
import { ChildState } from '../../State'

export class SoftDropSubstate extends ChildState {
  private dropedLines = 0
  private elapsed = 0
  private addedPoints = false

  protected disableParentUpdate = true
  protected duration = 50
  protected dropRatio = 1

  enter() {
    this.elapsed = 0
    this.dropedLines = 0
    this.addedPoints = false
  }

  update(deltaTime: number) {
    this.elapsed += deltaTime

    if (this.elapsed > this.duration) {
      this.elapsed -= this.duration

      if (this.game.board.hasCollisionInNextStep()) {
        this.parentState.setSubstate('lockDelay')
        this.addPointsForDrop()
        return
      }

      this.game.board.moveDown()
      this.dropedLines++
    }
  }

  render() {}

  handleInput(inputs: InputType[]) {
    if (!inputs.includes('ArrowDown')) {
      this.parentState.setSubstate(null)
      this.addPointsForDrop()
    }
  }

  private addPointsForDrop() {
    if (!this.addedPoints) {
      this.game.score.addPointForSoftDrop(this.dropedLines)
      this.addedPoints = true
    }
  }
}
