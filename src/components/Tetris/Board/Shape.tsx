import React from "react";
import styled from "styled-components";

import Brick from "../Brick";
import Tetris from "../../../tetris";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../constants";
import equalArrays from "../../../helpers/equalArrays";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

type Props = {
  tetris: Tetris;
};

type State = {
  shapeOnBoard: number[][];
  rowsToRemove: number[];
  newShapeDuringAnimation: number[][];
};

export default class Shape extends React.Component<Props, State> {
  state: State = {
    shapeOnBoard: [],
    rowsToRemove: [],
    newShapeDuringAnimation: [],
  };
  animation = false;

  componentDidMount() {
    this.props.tetris.on("updateShape", this.onUpdateShape);
    this.props.tetris.on("reducedRows", this.onReducedRows);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      !equalArrays(this.state.shapeOnBoard, nextState.shapeOnBoard) ||
      !equalArrays(this.state.rowsToRemove, nextState.rowsToRemove) ||
      !equalArrays(
        this.state.newShapeDuringAnimation,
        nextState.newShapeDuringAnimation
      )
    );
  }

  onUpdateShape = (shapeOnBoard) => {
    if (!this.animation) {
      this.setState({ shapeOnBoard, newShapeDuringAnimation: [] });
    } else if (!equalArrays(shapeOnBoard, this.state.shapeOnBoard)) {
      this.setState({ newShapeDuringAnimation: shapeOnBoard });
    }
  };

  onReducedRows = (reducedRows: number[]) => {
    if (this.animation) {
      return;
    }
    this.animation = true;
    this.setState({ rowsToRemove: reducedRows });
    setTimeout(() => {
      this.animation = false;
      this.setState({
        rowsToRemove: [],
        shapeOnBoard: this.props.tetris.getShapeOnBoard(),
        newShapeDuringAnimation: [],
      });
    }, 300);
  };

  render() {
    const { newShapeDuringAnimation, shapeOnBoard } = this.state;

    return (
      <Container>
        {newShapeDuringAnimation.map((row, y) => {
          return row.map(
            (color: number, x) =>
              (color && (
                <Brick
                  key={BOARD_HEIGHT * BOARD_WIDTH + y * row.length + x}
                  colorIndex={color}
                  x={x}
                  y={y}
                  scale={1}
                />
              )) ||
              null
          );
        })}
        {shapeOnBoard.map((row, y) => {
          return row.map(
            (color: number, x) =>
              (color && (
                <Brick
                  removed={!!this.state.rowsToRemove.find((row) => row === +y)}
                  offsetY={
                    this.state.rowsToRemove.filter((line) => line > y).length
                  }
                  key={BOARD_HEIGHT * BOARD_WIDTH * 2 + y * row.length + x}
                  colorIndex={color}
                  x={x}
                  y={y}
                  scale={1}
                />
              )) ||
              null
          );
        })}
      </Container>
    );
  }
}
