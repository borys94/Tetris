export enum ShapeType {
  IShape = "IShape",
  ZShape = "ZShape",
  SShape = "SShape",
  LShape = "LShape",
  JShape = "JShape",
  OShape = "OShape",
  TShape = "TShape",
}

export enum GameState {
  NotReady,
  ReadyToStart,
  Started,
  Pause,
  Finished,
}

export type GameEventName =
  | "UPDATE_BOARD"
  | "ON_LEVEL_UP"
  | "ON_SCORE_CHANGE"
  | "ON_REDUCED_ROWS_CHANGE"
  | "ON_SET_GAME_STATE";

export interface GameEvent {
  name: GameEventName;
  data?: any;
}
