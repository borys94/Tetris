import styled from "styled-components";

import { BRICK_SIZE, BRICK_COLORS } from "../../constants";

type BrickType = {
  color: number;
  x: number;
  y: number;
  size?: number;
  styles?: any;
};

const Brick = styled.div.attrs<BrickType>((props: BrickType) => ({
  style: {
    left: `${props.x * (props.size || BRICK_SIZE)}px`,
    top: `${props.y * (props.size || BRICK_SIZE)}px`,
    width: `${props.size || BRICK_SIZE}px`,
    height: `${props.size || BRICK_SIZE}px`,
    ...(props.color
      ? {
          backgroundColor: `${BRICK_COLORS[props.color - 1]}`,
        }
      : {
          borderRadius: "0",
          border: "none",
        }),
    ...(props.styles
      ? {
          ...props.styles,
        }
      : {
          border: "5px solid #ffffff22",
          borderBottom: "5px solid #00000055",
          borderRight: "5px solid #00000055",
        }),
  },
}))<BrickType>`
  position: absolute;
  box-sizing: border-box;
`;

export default Brick;
