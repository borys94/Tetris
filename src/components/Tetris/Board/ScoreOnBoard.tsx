import React from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 50px;
  color: var(--color-green);
  display: flex;
  position: absolute;
  top: 0;

  @keyframes showScore {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(2);
      opacity: 1;
    }

    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

type CenterProps = {
  animation: boolean;
};

const Center = styled.div<CenterProps>`
  margin: 50px auto;
  transform: scale(0);
  transform-origin: top;

  ${(props: CenterProps) =>
    props.animation &&
    css`
      ::before {
        content: attr(data-before);
        position: absolute;
        opacity: 0;
        transform: scale(1);
        animation: showScoreBackground;
        animation-duration: 1.5s;
      }
    `}

  @keyframes showScoreBackground {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }

  ${(props) =>
    props.animation &&
    css`
      animation: showScore 2000ms;
    `}
`;

type Props = {
  score: number;
};

type State = {
  score: number;
};

class Board extends React.Component<Props, State> {
  state = {
    score: 0,
  };
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.score + 30 < nextProps.score) {
      this.setState({ score: nextProps.score - this.props.score });
      setTimeout(() => this.setState({ score: 0 }), 2000);
    }
  }

  render() {
    return (
      <Container>
        <Center
          animation={this.state.score > 0}
          data-before={`+${this.state.score}`}
        >
          +{this.state.score}
        </Center>
      </Container>
    );
  }
}

export default Board;
