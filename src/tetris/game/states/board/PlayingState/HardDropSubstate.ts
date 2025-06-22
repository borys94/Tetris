import { ChildState } from '../../State'

export class HardDropSubstate extends ChildState {
  protected disableParentUpdate = true

  handleInput() {}

  enter() {}

  render() {}

  update() {
    let dropedLines = 0

    while (!this.game.board.isColisionInNextStep()) {
      this.game.board.moveDown()
      dropedLines++
    }

    this.game.board.addShapeToBoard()
    this.game.score.addPointForHardDrop(dropedLines)

    if (this.game.board.isLineToReduce()) {
      this.parentState.setSubstate('clearingLines')
    } else {
      this.parentState.setSubstate('blockDrop')
    }
  }
}
