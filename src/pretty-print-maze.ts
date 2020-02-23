import { INeighbourWalls, IPossibleMoves, ICell } from './interfaces';
import { WALLS, WALL_RELATIONS } from './constants';

function getWallType(wallType: INeighbourWalls) {
  const finding = WALLS.find(wall =>
    Object.keys(wall.conditions).every(
      dir => wall.conditions[(dir as keyof INeighbourWalls)] === wallType[(dir as keyof INeighbourWalls)]
    )
  );
  return finding?.representation;
}
export function prettyPrintMaze(maze: ICell[][]) {
  let isWallInDir:INeighbourWalls = {
    left: false,
    right: false,
    up: false,
    down: false
  };
  let prettyFormattedMaze:string = '';
  for(const row of maze) {
    for(const cell of row) {
        if (cell.tile === 'FLOOR') {
        prettyFormattedMaze += ' ';
      } else {
        isWallInDir = {
          left: false,
          right: false,
          up: false,
          down: false
        };
        for (const possibility of Object.keys(WALL_RELATIONS)) {
          const deltaY:number = cell.y + WALL_RELATIONS[(possibility as keyof IPossibleMoves)].y;
          const deltaX:number = cell.x + WALL_RELATIONS[(possibility as keyof IPossibleMoves)].x;
          if (!(
            deltaY < 0 ||
            deltaY >= maze.length ||
            deltaX < 0 ||
            deltaX >= row.length ||
            maze[deltaY][deltaX].tile !== 'WALL')
          ) {
            isWallInDir[(possibility as keyof IPossibleMoves)] = true;
          }
        }
        prettyFormattedMaze += getWallType(isWallInDir);
      }
    }
    prettyFormattedMaze += '\n';
  }
  console.log(prettyFormattedMaze);
}

