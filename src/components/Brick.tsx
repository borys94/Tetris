import styled from "styled-components";

import { BRICK_SIZE } from "../constants";

const COLORS = [
  "#ED8F03",
  "#9D50BB",
  "#CAC531",
  "#396afc",
  "#56ab2f",
  "#e53935",
];

type BrickType = {
  color: number;
  x: number;
  y: number;
};

const Brick = styled.div.attrs<BrickType>((props) => ({
  style: {
    left: `${props.x * BRICK_SIZE}px`,
    top: `${props.y * BRICK_SIZE}px`,
    ...(props.color
      ? {
          backgroundColor: `${COLORS[props.color - 1]}`,
        }
      : {
          borderRadius: "0",
          backgroundColor: "#010101",
        }),
  },
}))<BrickType>`
  position: absolute;
  box-sizing: border-box;
  width: ${BRICK_SIZE}px;
  height: ${BRICK_SIZE}px;
  border: 3px solid #ffffff22;
  border-bottom: 3px solid #00000077;
  border-right: 3px solid #00000077;
  border-radius: 3px;
`;

export default Brick;
