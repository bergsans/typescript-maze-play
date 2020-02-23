export enum Status {
  HasVisited,
  HasNotVisited
}

export interface IPathNode {
  x: number;
  y: number;
  status: string;
  path: ICoords[];
}

export interface ISuccessfullPath {
  path: ICoords[];
  endCoordinates: ICoords;
  startCoordinates: ICoords;
}

export interface ICell {
  tile: string;
  visited: Status;
  x: number;
  y: number;
}

export interface IMaze {
  cells: ICell[][];
  width: number;
  height: number;
}

export interface ITile {
  Wall: string;
  Floor: string;
}

export interface ISize {
  width: number;
  height: number;
}

export interface ICoords {
  x: number;
  y: number;
}

export type RelativeICoords = Pick<ICoords, 'x' | 'y'>;

export interface IPossibleMoves {
  up: RelativeICoords;
  down: RelativeICoords;
  left: RelativeICoords;
  right: RelativeICoords;
}

export interface INeighbourWalls {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}
