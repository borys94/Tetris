import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;

  > div {
    margin: 15px;
    display: flex;
  }

  span {
    margin: auto 0;
  }
`;

type KeyProps = {
  value: string;
};
const Key = styled.div<KeyProps>`
  display: inline-block;

  width: 100px;

  ::after {
    content: attr(value);
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
    background-color: #f7f7f7;
    font-family: sans-serif;
    margin: 0 10px;
    float: right;
  }
`;

const Navigation = () => (
  <Container>
    <div>
      <Key value="⭠" />
      <span>Move left</span>
    </div>
    <div>
      <Key value="⭢" />
      <span>Move right</span>
    </div>
    <div>
      <Key value="⭡" />
      <span>Rotate</span>
    </div>
    <div>
      <Key value="⭣" />
      <span>Soft drop</span>
    </div>
    <div>
      <Key value="Space" />
      <span>Hard drop</span>
    </div>
    <div>
      <Key value="P"></Key>
      <span>Pause / Play</span>
    </div>
  </Container>
);

export default React.memo(Navigation);
