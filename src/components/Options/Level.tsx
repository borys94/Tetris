import OptionBox from "./OptionBox";
import Text from "../Text";
import formatNumber from "../../helpers/formatNumber";

type Props = {
  level: number;
};

const Level = (props: Props) => (
  <OptionBox>
    <Text>Level</Text>
    <br />
    <Text>{formatNumber(props.level)}</Text>
  </OptionBox>
);

export default Level;
