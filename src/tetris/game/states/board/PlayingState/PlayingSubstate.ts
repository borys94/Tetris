import { TetrisStateChild } from '../../State'

export abstract class PlayingSubstate extends TetrisStateChild {
  protected disableParentUpdate = false

  isParentUpdateDisabled() {
    return this.disableParentUpdate
  }
}
