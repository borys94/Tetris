import styled from "styled-components";

export const Button = styled.button`
  color: white;
  font-size: 34px;
  line-height: 48px;
  background-color: #525252;
  border: none;
  outline: none;
  width: 270px;
  height: 50px;
  appearance: none;
  cursor: pointer;
  margin: 10px 0;

  font-family: "Game";
  border: 5px solid #74747277;
  border-bottom: 5px solid #070707;
  border-right: 5px solid #070707;

  :hover {
    filter: brightness(80%);
    line-height: 40px;
  }
`;

export default Button;
