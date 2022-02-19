import styled from "styled-components";

const Container = styled.div`
  margin: 20px;
  cursor: pointer;
  position: absolute;

  :hover {
    text-decoration: underline;
  }
`;

const BackButton = (props) => <Container {...props}>◃ Back</Container>;

export default BackButton;
