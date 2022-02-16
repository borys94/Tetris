import styled from "styled-components";

import { Panel } from "react95";

import NextShape from "./NextShape";
import Text from "../Text";

const Value = styled.div`
  color: #1d23d1;
  font-weight: bold;
  padding-left: 10px;
`;

type Props = {
  score: number;
  shapes: any;
  level: number;
  reducedRows: number;
};

const Level = ({ score, level, shapes, reducedRows }: Props) => (
  <Panel style={{ padding: "0.5rem", lineHeight: "1.5", width: 200 }}>
    <Text bold>Score:</Text>
    <Value>{score}</Value>
    <Text bold>Level:</Text>
    <Value>{level}</Value>
    <Text bold>Lines:</Text>
    <Value>{reducedRows}</Value>

    <NextShape shapes={shapes} />
  </Panel>
);

export default Level;
