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
  | "ON_LEVEL_CHANGE"
  | "ON_SCORE_CHANGE"
  | "ON_REDUCED_ROWS_CHANGE"
  | "ON_SET_GAME_STATE"
  | "ON_SHAPE_ADDED_TO_BOARD"
  | "ON_NEXT_SHAPES_CHANGE";

export interface GameEvent {
  name: GameEventName;
  data?: any;
}

export interface GameParams {
  width?: number;
  height?: number;
  level?: number;
  onEvent: (event: GameEvent) => void;
}
