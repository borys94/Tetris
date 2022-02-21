import Eventing from "./Eventing";

interface Actions {
  moveLeft: undefined;
  moveRight: undefined;
  rotate: undefined;
  playPause: undefined;
  hardDrop: undefined;
  startGoingDown: undefined;
  stopGoingDown: undefined;
}

export default class KeyboardController extends Eventing<Actions> {
  constructor() {
    super();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 40) {
      this.trigger("stopGoingDown");
    }
  };

  onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.keyCode === 37) {
      this.trigger("moveLeft");
    } else if (event.keyCode === 39) {
      this.trigger("moveRight");
    } else if (event.keyCode === 38) {
      this.trigger("rotate");
    } else if (event.keyCode === 40) {
      this.trigger("startGoingDown");
    } else if (event.keyCode === 80) {
      this.trigger("playPause");
    } else if (event.keyCode === 32) {
      this.trigger("hardDrop");
    }
  };
}
