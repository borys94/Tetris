import styled from "styled-components";

import Game from "./components/Game";

const Container = styled.div`
  display: flex;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StartContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
`;

function App() {
  return (
    <Container className="App">
      <StartContainer>
        <Game />
      </StartContainer>
    </Container>
  );
}

export default App;
