import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;

  button {
    margin: 10px;
  }
`;

export default ({ startNewGame, unPause, pause, canPause, canStart }) => {
  return (
    <Container>
      <button onClick={startNewGame}>Start new game</button>
      <button onClick={pause} disabled={!canPause}>
        Pause
      </button>
      <button onClick={unPause} disabled={!canStart}>
        Play
      </button>
    </Container>
  );
};
