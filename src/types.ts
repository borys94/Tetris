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
  ReadyToStart,
  Started,
  Pause,
  Finished,
}

export type GameEventName =
  | "UPDATE_BOARD"
  | "ON_START"
  | "ON_PAUSE"
  | "ON_FINISH"
  | "ON_LEVEL_UP"
  | "ON_SCORE_CHANGE";

export interface GameEvent {
  name: GameEventName;
  data?: any;
}
