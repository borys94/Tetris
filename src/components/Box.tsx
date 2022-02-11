import styled from "styled-components";

type Props = {
  children?: any;
};

const InnerBorder = styled.div`
  border: 5px solid var(--color-border);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const Border = styled.div`
  width: 100%;
  border: 5px solid #525252;
  border-bottom: 5px solid #070707;
  border-right: 5px solid #070707;
`;

const OuterBorder = styled.div`
  display: flex;
  border: 5px solid #070707;
  border-bottom: 5px solid #525252;
  border-right: 5px solid #525252;
  height: 100%;
  box-sizing: border-box;
`;

const Box = (props: Props) => (
  <OuterBorder>
    <Border>
      <InnerBorder>{props.children}</InnerBorder>
    </Border>
  </OuterBorder>
);

export default Box;
