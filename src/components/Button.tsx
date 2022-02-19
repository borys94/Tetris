import styled from "styled-components";

export const Button = styled.button`
  font-family: "Game";
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 300;
  background-color: var(--color-green);
  color: #fff !important;
  cursor: pointer;
  outline: none;
  text-decoration: none !important;
  display: inline-block;
  transition: all 150ms;
  margin: 5px 0;
  position: relative;

  svg {
    font-size: 25px;
    position: absolute;
    left: 20px;
    margin: auto;
    top: 0;
    bottom: 0;
    path {
      fill: var(--color-green);
    }
  }

  :hover {
    opacity: 0.85;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: #fff;
  color: var(--color-green) !important;
  border: 1px solid var(--color-green);
`;
