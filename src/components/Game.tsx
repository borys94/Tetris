import React from "react";
import styled from "styled-components";

import Brick from "./Brick";
import Board from "./Board";
import Score from "./Options/Score";
import Box from "./Box";
import NextShape from "./Options/NextShape";
import Level from "./Options/Level";
import { Button } from "./Button";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../constants";
import { GameState, GameEvent } from "../types";

import Engine from "../core/Engine";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const GameContainer = styled.div`
  position relative;
  width: 900px;
  display: flex;
  justify-content: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  font-size: 40px;

  > div:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: 0;
`;

type State = {
  board: number[][] | null;
  width: number;
  height: number;
  gameState: GameState | null;
};

class Game extends React.Component<{}, State> {
  currentFigure: any;
  engine: Engine | null = null;

  state = {
    board: [[]],
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    gameState: null,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
    this.startNewGame();
  }

  startNewGame = () => {
    this.engine = new Engine(this.state.width, this.state.height, this.onEvent);
    this.setState({
      gameState: this.engine.getState(),
    });
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
    } else if (gameEvent.name === "ON_START") {
      this.onStart();
    } else if (gameEvent.name === "ON_PAUSE") {
      this.onPause();
    } else if (gameEvent.name === "ON_FINISH") {
      this.onFinish();
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

  onPause = () => {
    this.setState({ gameState: GameState.Pause });
  };

  onStart = () => {
    this.setState({ gameState: GameState.Started });
  };

  onFinish = () => {
    this.setState({ gameState: GameState.Finished });
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
      <GameContainer>
        <Box>
          <Board width={this.state.width} height={this.state.height}>
            <Container>{this.renderBoard()}</Container>
          </Board>
        </Box>
        <OptionsContainer>
          <Score score={this.engine.getScore()} />
          <NextShape shape={this.engine.getNextShape()} />
          <Level level={this.engine.getLevel()} />
          <ButtonsContainer>
            {this.state.gameState === GameState.Started && (
              <Button onClick={this.pause}>Pause</Button>
            )}
            {this.state.gameState === GameState.Pause && (
              <Button onClick={this.start}>Start</Button>
            )}
            {this.state.gameState === GameState.ReadyToStart && (
              <Button onClick={this.start}>Start</Button>
            )}
            {this.state.gameState === GameState.Finished && (
              <Button onClick={this.startNewGame}>Try again</Button>
            )}
            <Button>Quit</Button>
          </ButtonsContainer>
        </OptionsContainer>
      </GameContainer>
    );
  }
}

export default Game;
