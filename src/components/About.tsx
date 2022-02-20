import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  justify-content: center;
  background-color: #eee;
  border-right: 1px solid #ddd;
  padding: 20px;
  text-align: center;
`;

const Footer = styled.div`
  margin-top: auto;
`;

export default class About extends React.Component {
  render() {
    return (
      <Container>
        <h1>About</h1>
        <Footer>
          <FontAwesomeIcon fontSize={30} icon={faGithub} />
        </Footer>
      </Container>
    );
  }
}
