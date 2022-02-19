import React from "react";
import styled from "styled-components";

import Menu from "./Menu";
import Brick from "../Brick";
import { GameState } from "../../../types";
import copy from "../../../helpers/copy";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const GameBoard = styled.div.attrs<Props>((props) => ({
  style: {
    width: `${props.width * props.size}px`,
    height: `${props.height * props.size}px`,
  },
}))`
  background-color: #ddd;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

type Props = {
  width: number;
  height: number;
  size: number;
  startNewGame: () => void;
  closeMenu: () => void;
  score: number;
  gameState: GameState;
  board: number[][];
  menu: boolean;
};

type State = {
  board: number[][];
  rowsToRemove: number[];
};

class Board extends React.Component<Props, State> {
  state: State = {
    board: [],
    rowsToRemove: [],
  };

  componentWillReceiveProps(nextProps: Props) {
    this.onNewBoard(nextProps.board);
  }

  onNewBoard(board: number[][]) {
    const newBoard = copy(board).reverse();
    const currentBoard = copy(this.state.board).reverse();

    let different = false;
    for (let y in newBoard) {
      for (let x in newBoard[+y]) {
        if (!currentBoard[y] || newBoard[y][x] !== currentBoard[y][x]) {
          different = true;
        }
      }
    }
    if (!different) {
      return;
    }
    this.setState({ board });

    let rowsToRemove: number[] = [];
    for (let y in newBoard) {
      for (let x in newBoard[+y]) {
        if (newBoard[y][x] === -1) {
          this.setState({ board, rowsToRemove: [] });
          return;
        }
      }
    }

    for (let y in newBoard) {
      if (newBoard[y].findIndex((color) => color <= 0) !== -1) {
        continue;
      }
      const row = board.length - +y - 1;
      rowsToRemove = [...rowsToRemove, row];
    }

    if (rowsToRemove.length) {
      this.setState({ rowsToRemove });
    }
  }

  renderBoard() {
    return this.state.board.map((row, y) => {
      return row.map(
        (color: number, x) =>
          (color && (
            <Brick
              removed={!!this.state.rowsToRemove.find((row) => row === +y)}
              offsetY={
                this.state.rowsToRemove.filter((line) => line > y).length
              }
              key={y * row.length + x}
              colorIndex={color}
              x={x}
              y={y}
              scale={1}
            />
          )) ||
          null
      );
    });
  }
  render() {
    return (
      <GameBoard {...this.props}>
        <Container>
          {this.renderBoard()}
          <Menu
            isOpen={this.props.menu}
            score={this.props.score}
            gameState={this.props.gameState}
            startNewGame={this.props.startNewGame}
            close={this.props.closeMenu}
          />
        </Container>
      </GameBoard>
    );
  }
}

export default Board;
