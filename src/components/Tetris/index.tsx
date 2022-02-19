import React from "react";

import Board from "./Board";
import Panel from "./Panel";
import Tetris from "../../tetris";

import { GameState, GameEvent } from "../../types";
import { BRICK_SIZE } from "../../constants";

type Props = {
  width: number;
  height: number;
  onSetGameState: (state: GameState) => void;
  size?: number;
  brick?: any;
  backgroundColor?: string;
  backgroundBrick?: any;
};

type State = {
  board: number[][];
  gameState: GameState;
  reducedRows: number;
  level: number;
  score: number;
  nextShapes: any[];
  menu: boolean;
  rowsToRemove: number[];
};

export default class TetrisGame extends React.Component<Props, State> {
  tetris: Tetris | null = null;

  state = {
    board: [[]],
    gameState: GameState.NotReady,
    reducedRows: 0,
    level: 0,
    score: 0,
    nextShapes: [],
    rowsToRemove: [],
    menu: true,
  };

  componentDidMount() {
    this.tetris = new Tetris({
      width: this.props.width,
      height: this.props.height,
      level: this.state.level,
      onEvent: this.onEvent,
    });
  }

  startNewGame = () => {
    if (this.tetris) {
      this.tetris.startNewGame();
      this.setState({ menu: false });
    }
  };

  closeMenu = () => {
    if (this.tetris) {
      this.unPause();
      this.setState({ menu: false });
    }
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
    this.pause();
    this.setState({ menu: true });
  };

  onEvent = (gameEvent: GameEvent) => {
    if (gameEvent.name === "UPDATE_BOARD") {
      this.setState({ board: gameEvent.data });
    } else if (gameEvent.name === "ON_SET_GAME_STATE") {
      this.setState({ gameState: gameEvent.data });
      if (gameEvent.data === GameState.Finished) {
        this.setState({ menu: true });
      }
    } else if (gameEvent.name === "ON_REDUCED_ROWS_CHANGE") {
      this.setState({ reducedRows: gameEvent.data });
    } else if (gameEvent.name === "ON_LEVEL_CHANGE") {
      this.setState({ level: gameEvent.data });
    } else if (gameEvent.name === "ON_SCORE_CHANGE") {
      this.setState({ score: gameEvent.data });
    } else if (gameEvent.name === "ON_NEXT_SHAPES_CHANGE") {
      this.setState({ nextShapes: gameEvent.data });
    }
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <Board
          width={this.props.width}
          height={this.props.height}
          size={BRICK_SIZE}
          startNewGame={this.startNewGame}
          closeMenu={this.closeMenu}
          score={this.state.score}
          gameState={this.state.gameState}
          board={this.state.board}
          menu={this.state.menu}
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
