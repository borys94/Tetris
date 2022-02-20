import React from "react";
import styled, { Keyframes, css } from "styled-components";

import Menu from "./Menu";
import Shape from "./Shape";
import BoardWithoutShape from "./BoardWithoutShape";
import ScoreOnBoard from "./ScoreOnBoard";
import { GameState } from "../../../types";
import Tetris from "../../../tetris";
import { shakeLeft, shakeRight, shakeDown } from "../../keyframes";
import { BRICK_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from "../../../constants";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

type GameBoardProps = {
  animationName: Keyframes | null;
};

const GameBoard = styled.div<GameBoardProps>`
  width: ${BOARD_WIDTH * BRICK_SIZE}px;
  height: ${BOARD_HEIGHT * BRICK_SIZE}px;
  background-color: #ddd;
  display: flex;
  flex-wrap: wrap;
  position: relative;

  ${(props) =>
    props.animationName &&
    css`
      animation: ${props.animationName} 300ms;
    `}
`;

type Props = {
  tetris: Tetris;
  startNewGame: () => void;
  closeMenu: () => void;
  gameState: GameState;
  menu: boolean;
};

type State = {
  animationName: Keyframes | null;
  score: number;
};

class Board extends React.Component<Props, State> {
  state: State = {
    animationName: null,
    score: 0,
  };

  componentDidMount() {
    this.props.tetris.on("reducedRows", this.onReducedRows);
    this.props.tetris.on("moveLeftFailed", this.onMoveLeftFailed);
    this.props.tetris.on("moveRightFailed", this.onMoveRightFailed);
    this.props.tetris.on("score", this.onScore);
  }

  onScore = (score: number) => {
    this.setState({ score });
  };

  onReducedRows = () => {
    this.setState({ animationName: shakeDown });
    setTimeout(() => this.setState({ animationName: null }), 300);
  };

  onMoveLeftFailed = () => {
    this.setState({ animationName: shakeLeft });
    setTimeout(() => this.setState({ animationName: null }), 300);
  };

  onMoveRightFailed = () => {
    this.setState({ animationName: shakeRight });
    setTimeout(() => this.setState({ animationName: null }), 300);
  };

  render() {
    return (
      <GameBoard animationName={this.state.animationName}>
        <Container>
          <Shape tetris={this.props.tetris} />
          <BoardWithoutShape tetris={this.props.tetris} />

          <Menu
            isOpen={this.props.menu}
            score={this.state.score}
            gameState={this.props.gameState}
            startNewGame={this.props.startNewGame}
            close={this.props.closeMenu}
          />
        </Container>
        <ScoreOnBoard score={this.state.score} />
      </GameBoard>
    );
  }
}

export default Board;
