import styled from "styled-components";

import { BRICK_SIZE, BRICK_COLORS } from "../../constants";

type BrickType = {
  colorIndex: number;
  x: number;
  y: number;
  scale: number;
  removed?: boolean;
  offsetY?: number;
};

const Brick = styled.div.attrs<BrickType>((props: BrickType) => ({
  style: {
    left: `${props.x * (props.scale * BRICK_SIZE)}px`,
    top: `${(props.y + (props.offsetY || 0)) * (props.scale * BRICK_SIZE)}px`,
    width: `${BRICK_SIZE}px`,
    height: `${BRICK_SIZE}px`,
    transform: `scale(${props.scale})`,

    ...(props.removed
      ? {
          animation: "hide 1500ms",
        }
      : {}),

    ...(props.offsetY
      ? {
          transition: "top 150ms ease-in",
        }
      : {}),

    ...(props.colorIndex
      ? {
          backgroundColor: `${BRICK_COLORS[props.colorIndex - 1]}`,
        }
      : {
          borderRadius: "0",
          border: "none",
        }),

    ...(props.colorIndex === -1
      ? {
          backgroundColor: `#ccc`,
          border: "0",
        }
      : {}),
  },
}))<BrickType>`
  position: absolute;
  box-sizing: border-box;
  border: 5px solid #ffffff22;
  border-bottom: 5px solid #00000033;
  border-right: 5px solid #00000033;
  transition: transform 300ms linear;
  transform-origin: 50% 100%;

  @keyframes hide {
    0% {
      transform: scaleY(1);
      opacity: 1;
    }
    10% {
      transform: scaleY(0);
      opacity: 0;
    }

    100% {
      transform: scaleY(0);
      opacity: 0;
    }
  }
`;

export default Brick;
