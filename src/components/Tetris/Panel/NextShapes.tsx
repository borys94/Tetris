import styled from "styled-components";

import Brick from "../Brick";
import Text from "../../Text";

const BRICK_SIZE = 20;

const Content = styled.div`
  min-height: 260px;
  padding: 10px 0;
`;

const ShapeContainer = styled.div`
  padding-top: ${BRICK_SIZE}px;
  padding-left: ${BRICK_SIZE}px;
  position: relative;
  height: 260px;
`;

type Props = {
  shapes: number[][][];
};

type ShapeComponentProps = {
  shape: number[][];
};

const ShapeComponent = (props: ShapeComponentProps) => {
  const positions = props.shape.filter((row) => row.find((color) => color));
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
              colorIndex={color}
              scale={0.5}
            />
          ) : null
        );
      })}
    </div>
  );
};

const NextShapes = (props: Props) => (
  <Content>
    <Text>Next</Text>
    <ShapeContainer>
      {props.shapes.map((shape, index) => (
        <ShapeComponent key={index} shape={shape} />
      ))}
    </ShapeContainer>
  </Content>
);

export default NextShapes;
