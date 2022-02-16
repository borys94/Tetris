import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import Game from "./components/Game";

const GlobalStyles = createGlobalStyle`

`;

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
      <ThemeProvider theme={original}>
        <StartContainer>
          <Game />
        </StartContainer>
      </ThemeProvider>
      <GlobalStyles />
    </Container>
  );
}

export default App;
