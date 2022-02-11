import styled from "styled-components";
import Box from "../Box";

type Props = {
  children?: any;
};

export const Content = styled.div`
  background-color: black;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  font-size: 40px;
  color: white;
  align-items: center;
`;

const Container = styled.div`
  width: 270px;
`;

const OptionBox = (props: Props) => (
  <Container>
    <Box>
      <Content>{props.children}</Content>
    </Box>
  </Container>
);

export default OptionBox;
