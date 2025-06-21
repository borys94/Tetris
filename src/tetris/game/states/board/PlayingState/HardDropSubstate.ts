import { SoftDropSubstate } from "./SoftDropSubstate"

export class HardDropSubstate extends SoftDropSubstate {
  protected duration = 25
  protected dropRatio = 2

  handleInput() {}
}