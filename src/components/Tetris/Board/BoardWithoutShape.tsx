import React from "react";

import Brick from "../Brick";
import Tetris from "../../../tetris";
import equalArrays from "../../../helpers/equalArrays";

type Props = {
  tetris: Tetris;
};

type State = {
  board: number[][];
  rowsToRemove: number[];
  animation: boolean;
};

class Board extends React.Component<Props, State> {
  state: State = {
    board: [],
    rowsToRemove: [],
    animation: false,
  };
  animation: boolean = false;

  componentDidMount() {
    this.props.tetris.on("reducedRows", this.onReducedRows);
    this.props.tetris.on("updateBoard", this.onUpdateBoard);
  }

  onReducedRows = (reducedRows: number[]) => {
    this.animation = true;
    this.setState({ rowsToRemove: reducedRows, animation: true });
    setTimeout(() => {
      this.setState({
        rowsToRemove: [],
        animation: false,
        board: this.props.tetris.getBoardWithoutShape(),
      });
      this.animation = false;
    }, 300);
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      !equalArrays(this.state.board, nextState.board) ||
      !equalArrays(this.state.rowsToRemove, nextState.rowsToRemove)
    );
  }

  onUpdateBoard = (board: number[][]) => {
    if (!this.animation) {
      this.setState({ board });
    }
  };

  render() {
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
}

export default Board;
