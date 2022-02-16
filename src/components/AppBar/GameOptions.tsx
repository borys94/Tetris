import { List, ListItem, Divider } from "react95";

type Props = {
  startNewGame: () => void;
  start: () => void;
  pause: () => void;
  canStart: boolean;
  canPause: boolean;
};

export default ({ startNewGame, start, pause, canStart, canPause }: Props) => (
  <List
    style={{
      position: "absolute",
      zIndex: 9999,
      margin: 0,
      left: "0",
      top: "100%",
    }}
    // onClick={() => setOpen(false)}
  >
    <ListItem onClick={startNewGame} disabled={canStart || canPause}>Start New Game</ListItem>
    <Divider />
    <ListItem onClick={start} disabled={!canStart}>
      Start
    </ListItem>
    <ListItem onClick={pause} disabled={!canPause}>
      Pause
    </ListItem>
  </List>
);
