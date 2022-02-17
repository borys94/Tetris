import styled from "styled-components";

import Text from "../../Text";

const Value = styled.div`
  color: #1d23d1;
  font-weight: bold;
  padding-left: 10px;
`;

const Container = styled.div`
  background-color: white;
  margin: 10px;
  border: 1px solid #aaa;
`;

type Props = {
  score: number;
  shapes: any;
  level: number;
  reducedRows: number;
};

const Result = ({ score, level, shapes, reducedRows }: Props) => (
  <Container style={{ padding: "0.5rem", lineHeight: "1.5", width: 200 }}>
    <Text bold>Score:</Text>
    <Value>{score}</Value>
    <Text bold>Level:</Text>
    <Value>{level}</Value>
    <Text bold>Lines:</Text>
    <Value>{reducedRows}</Value>
  </Container>
);

export default Result;
