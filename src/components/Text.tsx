import styled, { css } from "styled-components";

type Props = {
  bold?: boolean;
};

const Text = styled.div<Props>`
  font-size: 24px;
  ${(props) =>
    props.bold &&
    css`
      font-weight: bold;
    `}
`;

export default Text;
