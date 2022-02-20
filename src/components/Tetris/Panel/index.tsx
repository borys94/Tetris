import styled from "styled-components";

import Result from "./Result";
import NextShapes from "./NextShapes";
import { Button } from "../../Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const ButtonsContainer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
`;

type Props = {
  reducedRows: number;
  level: number;
  score: number;
  nextShapes: number[][][];
  openMenu: () => void;
};

const Panel = ({ score, nextShapes, level, reducedRows, openMenu }: Props) => (
  <Container>
    <Result
      score={score}
      shapes={nextShapes}
      level={level}
      reducedRows={reducedRows}
    />
    <NextShapes shapes={nextShapes} />
    <ButtonsContainer>
      <Button onClick={openMenu}>Menu</Button>
      {/* <SecondaryButton onClick={openMenu}>
        <Icon icon="logos:github-icon" />
        Github
      </SecondaryButton> */}
    </ButtonsContainer>
  </Container>
);

export default Panel;
