import OptionBox from "./OptionBox";
import Text from "../Text";
import formatNumber from "../../helpers/formatNumber";

type Props = {
  score: number;
};

const Score = (props: Props) => (
  <OptionBox>
    <Text>Score</Text>
    <br />
    <Text>{formatNumber(props.score)}</Text>
  </OptionBox>
);

export default Score;
