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
  }

  p {
    font-size: 24px;
    span {
      color: var(--color-purple);
    }
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
        <p>
          Result: <span>{this.props.score}</span>
        </p>
        <Button onClick={this.props.startNewGame}>Try again</Button>
      </Container>
    );
  }
}
