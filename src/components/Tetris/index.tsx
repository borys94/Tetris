import React from "react";

import Board from "./Board";
import Panel from "./Panel";
import Tetris from "../../tetris";

import { GameState } from "../../types";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../constants";

type State = {
  gameState: GameState;
  reducedRows: number;
  level: number;
  score: number;
  nextShapes: number[][][];
  menu: boolean;
};

export default class TetrisGame extends React.Component<{}, State> {
  tetris: Tetris;

  state = {
    gameState: GameState.NotReady,
    reducedRows: 0,
    level: 0,
    score: 0,
    nextShapes: [],
    menu: true,
  };

  constructor(props: {}) {
    super(props);
    this.tetris = new Tetris({
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      level: this.state.level,
    });
    this.tetris.on("reducedRows", this.onReducedRows);
    this.tetris.on("level", (level: number) => this.setState({ level }));
    this.tetris.on("score", (score: number) => this.setState({ score }));
    this.tetris.on("nextShapes", (nextShapes: number[][][]) =>
      this.setState({ nextShapes })
    );
    this.tetris.on("state", this.onSetGameState);
  }

  onReducedRows = (reducedRows: number[]) => {
    this.setState({ reducedRows: this.state.reducedRows + reducedRows.length });
  };

  onSetGameState = (gameState: GameState) => {
    this.setState({ gameState });

    if (gameState === GameState.Pause) {
      this.openMenu();
    } else if (gameState === GameState.Started) {
      this.closeMenu();
    } else if (gameState === GameState.Finished) {
      this.openMenu();
    }
  };

  startNewGame = () => {
    if (this.tetris) {
      this.tetris.startNewGame();
    }
  };

  closeMenu = () => {
    if (this.state.gameState === GameState.Pause) {
      this.unPause();
    }
    this.setState({ menu: false });
  };

  pause = () => {
    if (this.tetris) {
      this.tetris.pause();
    }
  };

  unPause = () => {
    if (this.tetris) {
      this.tetris.unPause();
    }
  };

  openMenu = () => {
    this.tetris.pause();
    this.setState({ menu: true });
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <Board
          startNewGame={this.startNewGame}
          closeMenu={this.closeMenu}
          gameState={this.state.gameState}
          menu={this.state.menu}
          tetris={this.tetris}
        />
        <Panel
          score={this.state.score}
          level={this.state.level}
          reducedRows={this.state.reducedRows}
          nextShapes={this.state.nextShapes}
          openMenu={this.openMenu}
        />
      </div>
    );
  }
}
