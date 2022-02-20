import React from "react";
import styled, { css } from "styled-components";

import Text from "../../Text";

const Value = styled.div`
  color: var(--color-purple);
  font-weight: bold;
  font-size: 20px;
  padding-left: 10px;
`;

const Container = styled.div`
  width: 200px;
  padding: 20px 0;

  > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
`;

type Props = {
  score: number;
  shapes: number[][][];
  level: number;
  reducedRows: number;
};

const Result = ({ score, level, shapes, reducedRows }: Props) => (
  <Container>
    <div>
      <Text>Score</Text>
      <Score score={score} />
    </div>
    <div>
      <Text>Level</Text>
      <Value>{level}</Value>
    </div>
    <div>
      <Text>Lines</Text>
      <Value>{reducedRows}</Value>
    </div>
  </Container>
);

type ScoreContainerProps = {
  animate: boolean;
};

const ScoreContainer = styled.div<ScoreContainerProps>`
  transition: transform 50ms ease-out;
  transform: scale(1);
  color: var(--color-purple);
  font-weight: bold;
  font-size: 20px;

  ${(props: ScoreContainerProps) =>
    props.animate &&
    css`
      ::before {
        content: attr(data-before);
        position: absolute;
        opacity: 0;
        transform: scale(1);
        animation: score-animation;
        animation-duration: 0.6s;
      }
    `}

  @keyframes score-animation {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      transform: scale(5);
      opacity: 0;
    }
  }
`;

type ScoreState = {
  score: number;
  newScore: number;
  oldScore: number;
};

type ScoreProps = {
  score: number;
};

class Score extends React.Component<ScoreProps, ScoreState> {
  state = {
    score: 0,
    newScore: 0,
    oldScore: 0,
  };

  iteration: number = 0;
  animate: boolean = false;

  interval: number | null = null;

  componentWillReceiveProps(nextProps: ScoreProps) {
    if (nextProps.score === this.state.newScore) {
      return;
    }
    if (nextProps.score <= this.state.newScore + 1) {
      if (this.animate) {
        this.setState({
          newScore: nextProps.score,
        });
      } else {
        this.setState({
          oldScore: nextProps.score,
          newScore: nextProps.score,
          score: nextProps.score,
        });
      }

      return;
    } else {
      this.animate = true;
    }

    if (nextProps.score !== this.state.newScore) {
      this.setState({
        oldScore: this.state.score,
        newScore: nextProps.score,
      });

      if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = 0;
      }
      this.interval = window.setInterval(this.updateScore, 30);
    }
  }

  updateScore = () => {
    const nextValue = Math.ceil(
      this.state.score + (this.state.newScore - this.state.oldScore) / 30
    );
    if (this.interval && nextValue >= this.state.newScore) {
      this.setState({
        score: this.state.newScore,
        oldScore: this.state.newScore,
      });
      window.clearInterval(this.interval);
      this.interval = 0;
      this.iteration = 0;
      this.animate = false;
      return;
    }

    this.setState({ score: nextValue });
    this.iteration++;
  };

  render() {
    return (
      <ScoreContainer animate={this.animate} data-before={this.state.score}>
        {this.state.score}
      </ScoreContainer>
    );
  }
}

export default Result;
