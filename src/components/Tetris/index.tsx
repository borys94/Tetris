import React from "react";
import styled from "styled-components";
import { BRICK_SIZE } from "../../constants";

import Brick from "./Brick";
import Board from "./Board";
import Result from "./Result";
import NextShapes from "./NextShapes";
import Tetris from "../../tetris";

import { GameState, GameEvent } from "../../types";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

type Props = {
  width: number;
  height: number;
  onSetGameState: (state: GameState) => void;
  size?: number;
  brick?: any;
  backgroundColor?: string;
  backgroundBrick?: any;
  children: any;
};

type State = {
  board: number[][];
  gameState: GameState | null;
  reducedRows: number;
  level: number;
  score: number;
  nextShapes: any[];
};

export default class TetrisGame extends React.Component<Props, State> {
  tetris: Tetris | null = null;

  state = {
    board: [[]],
    gameState: null,
    reducedRows: 0,
    level: 0,
    score: 0,
    nextShapes: [],
  };

  componentDidMount() {
    this.tetris = new Tetris({
      width: this.props.width,
      height: this.props.height,
      level: this.state.level,
      onEvent: this.onEvent,
    });
  }

  startNewGame() {
    if (this.tetris) {
      this.tetris.startNewGame();
      this.props.onSetGameState(this.tetris.getState());
    }
  }

  pause = () => {
    if (this.tetris) {
      this.tetris.pause();
      this.props.onSetGameState(this.tetris.getState());
    }
  };

  unPause = () => {
    if (this.tetris) {
      this.tetris.unPause();
      this.props.onSetGameState(this.tetris.getState());
    }
  };

  onEvent = (gameEvent: GameEvent) => {
    if (gameEvent.name === "UPDATE_BOARD") {
      this.setState({ board: gameEvent.data });
    } else if (gameEvent.name === "ON_SET_GAME_STATE") {
      this.setState({ gameState: gameEvent.data });
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

  renderBoard() {
    return this.state.board.map((row, y) => {
      return row.map(
        (color, x) =>
          (color && (
            <Brick
              key={y + row.length + x}
              color={color}
              x={x}
              y={y}
              size={this.props.size || BRICK_SIZE}
              styles={this.props.brick}
            />
          )) ||
          null
      );
    });
  }

  renderBackground() {
    return this.state.board.map((row, y) => {
      return row.map((color, x) => (
        <Brick
          key={y + row.length + x}
          color={color}
          x={x}
          y={y}
          size={this.props.size || BRICK_SIZE}
          styles={{
            boxSizing: "content-box",
            backgroundColor: "white",
            ...this.props.backgroundBrick,
          }}
        />
      ));
    });
  }

  render() {
    return this.props.children({
      score: this.state.score,
      level: this.state.level,
      reducedRows: this.state.reducedRows,
      board: this.state.board,
      Board: () => (
        <Board
          backgroundColor={this.props.backgroundColor}
          width={this.props.width}
          height={this.props.height}
          size={this.props.size || BRICK_SIZE}
        >
          <Container>
            {this.renderBackground()}
            {this.renderBoard()}
          </Container>
        </Board>
      ),
      Result: () => (
        <Result
          score={this.state.score}
          shapes={this.state.nextShapes}
          level={this.state.level}
          reducedRows={this.state.reducedRows}
        />
      ),
      NextShapes: () => (
        <NextShapes shapes={this.state.nextShapes} styles={this.props.brick} />
      ),
    });
  }
}
