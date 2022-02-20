import React from "react";
import styled from "styled-components";

import { Button } from "../../../Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;

  h1 {
    font-size: 50px;
    margin-bottom: 0;
  }
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 80px;

  > div {
    margin: auto 0;
  }

  > div:first-of-type {
    font-size: 24px;
    margin-right: 20px;
  }

  > div:last-of-type {
    font-size: 45px;
    color: var(--color-purple);
  }
`;

type Props = {
  score: number;
  startNewGame: () => void;
};

export default class GameOver extends React.Component<Props> {
  render() {
    return (
      <Container>
        <h1>Game Over</h1>
        <ResultContainer>
          <div>Result</div>
          <div>{this.props.score}</div>
        </ResultContainer>
        <Button onClick={this.props.startNewGame}>Try again</Button>
      </Container>
    );
  }
}
