import React from "react";
import styled from "styled-components";

import Menu from "./Menu";
import Tetris from "./Tetris";

import { GameState } from "../types";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: center;
`;

const GameContainer = styled.div`
  position relative;
  display: flex;
  justify-content: center;
`;

type State = {
  board: number[][];
  gameState: GameState | null;
  reducedRows: number;
  level: number;
  score: number;
  nextShapes: any[];
};

class Game extends React.Component<{}, State> {
  tetris = React.createRef<Tetris>();

  state = {
    board: [[]],
    gameState: null,
    reducedRows: 0,
    level: 0,
    score: 0,
    nextShapes: [],
  };

  startNewGame = () => {
    if (this.tetris.current) {
      this.tetris.current.startNewGame();
    }
  };

  pause = () => {
    if (this.tetris.current) {
      this.tetris.current.pause();
    }
  };

  unPause = () => {
    if (this.tetris.current) {
      this.tetris.current.unPause();
    }
  };

  onSetGameState = (gameState) => {
    this.setState({ gameState });
  };

  render() {
    return (
      <Container>
        <Menu
          startNewGame={this.startNewGame}
          unPause={this.unPause}
          pause={this.pause}
          canPause={this.state.gameState === GameState.Started}
          canStart={this.state.gameState === GameState.Pause}
        />
        <GameContainer>
          <Tetris
            ref={this.tetris}
            width={10}
            height={16}
            onSetGameState={this.onSetGameState}
          >
            {({ Board, Result, NextShapes }): any => (
              <div style={{ display: "flex" }}>
                <Board />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Result />
                  <NextShapes />
                </div>
              </div>
            )}
          </Tetris>
        </GameContainer>
      </Container>
    );
  }
}

export default Game;
