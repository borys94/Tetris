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

export interface GameParams {
  width?: number;
  height?: number;
  level?: number;
}
