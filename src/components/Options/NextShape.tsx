import styled from "styled-components";
import { Panel } from "react95";

import Shape from "../../core/Shape";
import Brick from "../Brick";

type Props = {
  shapes: Shape[] | null;
};

const Content = styled.div`
  min-height: 260px;
`;

const ShapeContainer = styled.div`
  padding-top: 20px;
  position: relative;
`;

type ShapeComponentProps = {
  shape: Shape;
};
const ShapeComponent = (props: ShapeComponentProps) => {
  let positions = props.shape ? props.shape.getPositions() : [[]];
  positions = positions.filter((row) => row.find((color) => color));
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
    <div style={{ height: 20 * positions.length + 20, position: "relative" }}>
      {props.shape &&
        positions.map((row, y) => {
          return row.map((color: number, x) =>
            color !== 0 ? (
              <Brick x={x - minX + 1} y={y} color={color as never} size={20} />
            ) : null
          );
        })}
    </div>
  );
};

const Score = (props: Props) => (
  <Panel variant="well" style={{ width: "100%" }}>
    <Content>
      <ShapeContainer>
        {props.shapes &&
          props.shapes.map((shape, index) => <ShapeComponent shape={shape} />)}
      </ShapeContainer>
    </Content>
  </Panel>
);

export default Score;
