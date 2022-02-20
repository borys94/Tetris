import React from "react";
import styled, { css } from "styled-components";

import BackButton from "./BackButton";
import Navigation from "./Navigation";
import GameOver from "./GameOver";

import { Button, SecondaryButton } from "../../../Button";
import Background from "../../../../assets/background.png";
import { GameState } from "../../../../types";

const Container = styled.div<any>`
  ${(props) =>
    props.isOpen
      ? css`
          transform: translateX(0);
        `
      : css`
          transform: translateX(-500px);
          pointer-events: none;
        `}

  overflow: hidden;
  display: flex;

  transition: opacity, transform 150ms ease-out;
  background-color: #fffa;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;

  ::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;

    ${(props) =>
      (props.gameState === GameState.NotReady ||
        props.gameState === GameState.ReadyToStart) &&
      css`
        background-image: url(${Background});
      `}
    background-size: 100%;
    pointer-events: none;
  }

  button {
    width: 200px;
  }
`;

const Content = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  z-index: 1;
  button {
    margin: 10px auto;
  }
`;

const Tab = styled.div<any>`
  transition: all 150ms;
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  ${(props) =>
    props.isOpen
      ? css`
          transform: translateX(0);
        `
      : props.main
      ? css`
          transform: translateX(-500px);
        `
      : css`
          transform: translateX(500px);
        `}
`;

const CloseButton = styled.div`
  font-size: 24px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  margin: 15px;
  position: absolute;
  right: 0;
  z-index: 2;
  transition: all 150ms;
  cursor: pointer;

  :hover {
    transform: scale(1.2);
  }

  ::after {
    content: "✕";
    margin: auto;
  }
`;

type Props = {
  isOpen: boolean;
  score: number;
  startNewGame: () => void;
  close: () => void;
  gameState: GameState;
};

type State = {
  menuTab: MenuTab;
};

enum MenuTab {
  Main,
  Navigation,
  GameOver,
}

export default class Menu extends React.Component<Props, State> {
  state = {
    menuTab: MenuTab.Main,
  };

  renderStart() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
        }}
      >
        <Button onClick={this.props.startNewGame}>Start new game</Button>
        <SecondaryButton
          onClick={() => this.setState({ menuTab: MenuTab.Navigation })}
        >
          Navigation
        </SecondaryButton>
      </div>
    );
  }

  renderGameOver() {
    return (
      <GameOver
        score={this.props.score}
        startNewGame={this.props.startNewGame}
      />
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      !this.props.isOpen &&
      nextProps.isOpen &&
      this.props.gameState === GameState.Finished
    ) {
      this.setState({ menuTab: MenuTab.GameOver });
    }

    if (this.props.isOpen && !nextProps.isOpen) {
      this.setState({ menuTab: MenuTab.Main });
    }
  }

  render() {
    return (
      <Container isOpen={this.props.isOpen} gameState={this.props.gameState}>
        {this.props.gameState === GameState.Pause && (
          <CloseButton onClick={this.props.close} />
        )}
        <Content>
          <Tab main isOpen={this.state.menuTab === MenuTab.Main}>
            {this.renderStart()}
          </Tab>
          <Tab main isOpen={this.state.menuTab === MenuTab.GameOver}>
            {this.renderGameOver()}
          </Tab>
          <Tab isOpen={this.state.menuTab === MenuTab.Navigation}>
            <BackButton
              onClick={() => this.setState({ menuTab: MenuTab.Main })}
            />
            <Navigation />
          </Tab>
        </Content>
      </Container>
    );
  }
}
