import React from "react";
import styled from "styled-components";

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
        <GameContainer>
          <Tetris
            ref={this.tetris}
            width={10}
            height={16}
            onSetGameState={this.onSetGameState}
          />
        </GameContainer>
      </Container>
    );
  }
}

export default Game;
