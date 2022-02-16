import styled from "styled-components";

import { BRICK_SIZE } from "../constants";

const COLORS = [
  "#c21305",
  "#00b4c4",
  "#ca21c2",
  "#0107ca",
  "#a0940b",
  "#0b8607",
  "#686668",
];

type BrickType = {
  color: number;
  x: number;
  y: number;
  size?: number;
};

const Brick = styled.div.attrs<BrickType>((props: BrickType) => ({
  style: {
    left: `${props.x * (props.size || BRICK_SIZE)}px`,
    top: `${props.y * (props.size || BRICK_SIZE)}px`,
    width: `${props.size || BRICK_SIZE}px`,
    height: `${props.size || BRICK_SIZE}px`,
    ...(props.color
      ? {
          backgroundColor: `${COLORS[props.color - 1]}`,
        }
      : {
          borderRadius: "0",
          backgroundColor: "#010101",
          border: "none",
        }),
  },
}))<BrickType>`
  position: absolute;
  box-sizing: border-box;
  border: 5px solid #ffffff22;
  border-bottom: 5px solid #00000055;
  border-right: 5px solid #00000055;
`;

export default Brick;
