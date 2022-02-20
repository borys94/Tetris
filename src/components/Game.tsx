import styled from "styled-components";

import Tetris from "./Tetris";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const GameContainer = styled.div`
  position relative;
  display: flex;
  justify-content: center;
`;

const Game = () => (
  <Container>
    <GameContainer>
      <Tetris />
    </GameContainer>
  </Container>
);

export default Game;
