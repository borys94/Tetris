import React from "react";
import styled from "styled-components";

import Brick from "../Brick";
import Tetris from "../../../tetris";

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

  onUpdateShape = (shapeOnBoard) => {
    if (!this.animation) {
      this.setState({ shapeOnBoard, newShapeDuringAnimation: [] });
    } else {
      this.setState({ newShapeDuringAnimation: shapeOnBoard });
    }
  };

  onReducedRows = (reducedRows: number[]) => {
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
    let arr: number[][] = [];
    for (let y in shapeOnBoard) {
      for (let x in shapeOnBoard[y]) {
        if (!arr[y]) {
          arr[y] = [];
        }
        arr[y][x] =
          (newShapeDuringAnimation[y] && newShapeDuringAnimation[y][x]) ||
          shapeOnBoard[y][x];
      }
    }
    return (
      <Container>
        {arr.map((row, y) => {
          return row.map(
            (color: number, x) =>
              (color && (
                <Brick
                  removed={!!this.state.rowsToRemove.find((row) => row === +y)}
                  offsetY={
                    newShapeDuringAnimation[y] && newShapeDuringAnimation[y][x]
                      ? 0
                      : this.state.rowsToRemove.filter((line) => line > y)
                          .length
                  }
                  key={200 + y * row.length + x}
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
