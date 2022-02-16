import React from "react";
import { AppBar, Toolbar, Button } from "react95";

import GameOptions from "./GameOptions";

export default ({ startNewGame, start, pause, canPause, canStart }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <AppBar style={{ zIndex: 1 }}>
      <Toolbar style={{ justifyContent: "space-between" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button variant="menu" onClick={() => setOpen(!open)} active={open}>
            Game
          </Button>
          {open && (
            <GameOptions
              startNewGame={() => {
                startNewGame();
                setOpen(false);
              }}
              start={start}
              pause={pause}
              canPause={canPause}
              canStart={canStart}
            />
          )}
          <Button variant="menu" disabled>
            Options
          </Button>
          <Button variant="menu" disabled>
            Help
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};
