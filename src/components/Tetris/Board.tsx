import styled from "styled-components";

type Props = {
  width: number;
  height: number;
  size: number;
  children?: any;
  backgroundColor?: string;
};

const GameBoard = styled.div.attrs<Props>((props) => ({
  style: {
    width: `${props.width * props.size}px`,
    height: `${props.height * props.size}px`,
    backgroundColor: props.backgroundColor || "white",
  },
}))`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  border: 1px solid #aaa;
`;

const Board = (props: Props) => (
  <GameBoard {...props}>{props.children}</GameBoard>
);

export default Board;
