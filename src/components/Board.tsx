import React from "react";
import styled from "styled-components";
import { BRICK_SIZE } from "../constants";

type Props = {
  width: number;
  height: number;
  children?: any;
};

const GameBoard = styled.div.attrs<Props>((props) => ({
  style: {
    width: `${props.width * BRICK_SIZE}px`,
    height: `${props.height * BRICK_SIZE}px`,
  },
}))`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const Board = (props: Props) => (
  <GameBoard {...props}>{props.children}</GameBoard>
);

export default Board;
