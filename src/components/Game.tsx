import React from "react";
import styled from "styled-components";
import { Panel } from "react95";

import AppBar from "./AppBar";
import Brick from "./Brick";
import Board from "./Board";
import Options from "./Options";
import Engine from "../core/Engine";

import { BOARD_WIDTH, BOARD_HEIGHT } from "../constants";
import { GameState, GameEvent } from "../types";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const GameContainer = styled.div`
  position relative;
  width: 900px;
  display: flex;
  margin-top: 50px;
  justify-content: center;
`;

const OptionsContainer = styled.div`
  position: absolute;
  left: 0;
  top: 50px;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  font-size: 18px;

  > div:not(:last-child) {
    margin-bottom: 20px;
  }
`;

type State = {
  board: number[][] | null;
  width: number;
  height: number;
  gameState: GameState | null;
  reducedRows: number;
};

class Game extends React.Component<{}, State> {
  currentFigure: any;
  engine: Engine | null = null;

  state = {
    board: [[]],
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    gameState: null,
    reducedRows: 0,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
    this.engine = new Engine(this.state.width, this.state.height, this.onEvent);
  }

  startNewGame = () => {
    if (this.engine) {
      this.engine.startNewGame();
      this.start();
    }
  };

  pause = () => {
    if (this.engine) {
      this.engine.pause();
    }
  };

  start = () => {
    if (this.engine) {
      this.engine.start();
    }
  };

  onEvent = (gameEvent: GameEvent) => {
    if (gameEvent.name === "UPDATE_BOARD") {
      this.updateBoard(gameEvent.data);
    } else if (gameEvent.name === "ON_SET_GAME_STATE") {
      this.setGameState(gameEvent.data);
    } else if (gameEvent.name === "ON_REDUCED_ROWS_CHANGE") {
      this.setState({ reducedRows: gameEvent.data });
    }
  };

  onKeyDown = (event: any) => {
    if (this.engine === null) {
      return;
    }
    if (event.keyCode === 37) {
      this.engine.moveLeft();
    } else if (event.keyCode === 39) {
      this.engine.moveRight();
    } else if (event.keyCode === 38) {
      this.engine.rotate();
    } else if (event.keyCode === 40) {
      this.engine.goDown();
    }
  };

  updateBoard = (board: number[][]) => {
    this.setState({ board });
  };

  setGameState = (gameState: GameState) => {
    this.setState({ gameState });
  };

  renderBoard() {
    if (this.state.board === null) {
      return null;
    }
    return this.state.board.map((row, y) => {
      return row.map((color, x) => <Brick color={color} x={x} y={y} />);
    });
  }

  render() {
    if (!this.engine) {
      return null;
    }
    return (
      <>
        <AppBar
          startNewGame={this.startNewGame}
          start={this.start}
          pause={this.pause}
          canPause={this.state.gameState === GameState.Started}
          canStart={this.state.gameState === GameState.Pause}
        />
        <GameContainer>
          <OptionsContainer>
            <Options
              score={this.engine.getScore()}
              shapes={this.engine.getNextShapes()}
              level={this.engine.getLevel()}
              reducedRows={this.state.reducedRows}
            />
          </OptionsContainer>
          <Panel style={{ padding: 5 }}>
            <Board width={this.state.width} height={this.state.height}>
              <Container>{this.renderBoard()}</Container>
            </Board>
          </Panel>
        </GameContainer>
      </>
    );
  }
}

export default Game;
