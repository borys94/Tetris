import styled from "styled-components";
import OptionBox from "./OptionBox";
import Shape from "../../core/Shape";
import Brick from "../Brick";
import Text from "../Text";

type Props = {
  shape: Shape | null;
};

const Content = styled.div`
  height: 220px;
`;

const ShapeContainer = styled.div`
  padding-top: 40px;
  position: relative;
`;

const ShapeComponent = (props: Props) => (
  <div>
    {props.shape &&
      props.shape.getPositions().map((row, y) => {
        return [0, ...row, 0].map((color: number, x) => (
          <Brick x={x} y={y} color={color as never} />
        ));
      })}
  </div>
);

const Score = (props: Props) => (
  <OptionBox>
    <Content>
      <Text>Next</Text>
      <ShapeContainer>
        <ShapeComponent shape={props.shape} />
      </ShapeContainer>
    </Content>
  </OptionBox>
);

export default Score;
