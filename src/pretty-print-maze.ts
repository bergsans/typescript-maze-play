import { INeighbourWalls, IPossibleMoves, IMaze, ISuccessfullPath } from './interfaces';
import { WALLS, WALL_RELATIONS } from './constants';

function getWallType(wallType: INeighbourWalls): string {
  const finding = WALLS.find(wall =>
    Object.keys(wall.conditions).every(
      dir => wall.conditions[dir as keyof INeighbourWalls] === wallType[dir as keyof INeighbourWalls],
    ),
  );
  return finding!.representation;
}

export function prettyPrintMaze(maze: IMaze, foundPath?: ISuccessfullPath): string {
  const prettyFormattedMaze: string[] = [];
  for (const row of maze.cells) {
    for (const cell of row) {
      if (cell.tile === ' ' || cell.tile === 'FLOOR') {
        if (foundPath !== undefined) {
          const { startCoordinates, endCoordinates } = foundPath;
          if (startCoordinates.x === cell.x && startCoordinates.y === cell.y) {
            prettyFormattedMaze.push('S');
          } else if (endCoordinates.x === cell.x && endCoordinates.y === cell.y) {
            prettyFormattedMaze.push('E');
          } else if (foundPath.path.some(node => node.x === cell.x && node.y === cell.y)) {
            prettyFormattedMaze.push('.');
          } else {
            prettyFormattedMaze.push(' ');
          }
        } else {
          prettyFormattedMaze.push(' ');
        }
      } else {
        const isWallInDir: INeighbourWalls = {
          left: false,
          right: false,
          up: false,
          down: false,
        };
        for (const possibility of Object.keys(WALL_RELATIONS)) {
          const deltaY: number = cell.y + WALL_RELATIONS[possibility as keyof IPossibleMoves].y;
          const deltaX: number = cell.x + WALL_RELATIONS[possibility as keyof IPossibleMoves].x;
          if (
            !(
              deltaY < 0 ||
              deltaY >= maze.cells.length ||
              deltaX < 0 ||
              deltaX >= row.length ||
              maze.cells[deltaY][deltaX].tile !== 'WALL'
            )
          ) {
            isWallInDir[possibility as keyof IPossibleMoves] = true;
          }
        }
        prettyFormattedMaze.push(getWallType(isWallInDir));
      }
    }
    prettyFormattedMaze.push('\n');
  }
  return prettyFormattedMaze.join('');
}
