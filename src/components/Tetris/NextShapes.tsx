import styled from "styled-components";

import Shape from "../../tetris/Shape";
import Brick from "./Brick";

const BRICK_SIZE = 20;

const Content = styled.div`
  min-height: 260px;
  border: 1px solid #aaa;
  margin: 10px;
`;

const ShapeContainer = styled.div`
  padding-top: ${BRICK_SIZE}px;
  padding-left: ${BRICK_SIZE}px;
  position: relative;
`;

type Props = {
  shapes: Shape[];
  styles: any;
};

type ShapeComponentProps = {
  shape: Shape;
  styles: any;
};

const ShapeComponent = (props: ShapeComponentProps) => {
  const positions = props.shape
    .getPositions()
    .filter((row) => row.find((color) => color));
  let minX = 5;
  let maxX = 0;
  positions.forEach((row, y) => {
    row.forEach((color, x) => {
      if (positions[y][x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    });
  });
  return (
    <div
      style={{
        height: BRICK_SIZE * positions.length + BRICK_SIZE,
        position: "relative",
      }}
    >
      {positions.map((row, y) => {
        return row.map((color: number, x) =>
          color !== 0 ? (
            <Brick
              key={y * row.length + x}
              x={x - minX}
              y={y}
              color={color as never}
              size={BRICK_SIZE}
              styles={props.styles}
            />
          ) : null
        );
      })}
    </div>
  );
};

const NextShapes = (props: Props) => (
  <Content>
    <ShapeContainer>
      {props.shapes &&
        props.shapes.map((shape, index) => (
          <ShapeComponent key={index} shape={shape} styles={props.styles} />
        ))}
    </ShapeContainer>
  </Content>
);

export default NextShapes;
