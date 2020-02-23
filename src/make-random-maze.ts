import { IMaze, Status, IPossibleMoves, ISize, ICoords, ICell } from './interfaces';
import { POSSIBLE_MOVES, WALL_RELATIONS } from './constants';

function isEven(x: number) {
  return x % 2 === 0;
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

function startCoords(pos: ISize): ICoords {
  const x = randomInt(pos.width);
  const y = randomInt(pos.height);
  return x % 2 === 1 && y % 2 === 1 ? { x, y } : startCoords(pos);
}

function emptyMap(width: number, height: number): ICell[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (__, x) =>
      y % 2 === 0 || x % 2 === 0
        ? {
            tile: 'WALL',
            visited: Status.HasVisited,
            x,
            y
          }
        : {
            tile: 'FLOOR',
            visited: Status.HasNotVisited,
            x,
            y
          }
    )
  );
}

function whichDirectionsArePossible(
  maze: ICell[][],
  currentICoords: ICoords,
  width: number,
  height: number
): string[] {
  function isValid<Key extends keyof IPossibleMoves>(direction: Key) {
    const thisY = currentICoords.y + POSSIBLE_MOVES[direction].y;
    const thisX = currentICoords.x + POSSIBLE_MOVES[direction].x;
    return (
      currentICoords.y + POSSIBLE_MOVES[direction].y >= 0 &&
      currentICoords.y + POSSIBLE_MOVES[direction].y < height &&
      currentICoords.x + POSSIBLE_MOVES[direction].x >= 0 &&
      currentICoords.x + POSSIBLE_MOVES[direction].x < width &&
      maze[thisY][thisX].visited !== Status.HasVisited
    );
  }
  return (
    Object.keys(POSSIBLE_MOVES).filter(dir =>
      isValid(dir as keyof IPossibleMoves)
    ) || []
  );
}

export function makeRandomMaze(w: number, h: number): IMaze {
  const width = !isEven(w) ? w : w + 1;
  const height = !isEven(h) ? h : h + 1;

  const { x, y } = startCoords({ width, height });
  const maze: ICell[][] = emptyMap(width, height);

  // 1. Make the initial Cell the current Cell and mark it as visited
  maze[y][x].visited = Status.HasVisited;
  let currentICoords = maze[y][x];
  const stack = [currentICoords];

  // 2. While there are unvisited Cells
  while (stack.length !== 0) {
    if (!(currentICoords.x && currentICoords.y)) {
      continue;
    }

    const availableDirections = whichDirectionsArePossible(
      maze,
        { x: currentICoords.x, y: currentICoords.y },
      width,
      height
    );

    // 2.1 If the current Cell has any neighbours which have not been visited
    if (availableDirections.length > 0) {
      // 2.1.1 Choose randomly one of the unvisited neighbours
      const randomDirection = randomInt(availableDirections.length);
      const dir = availableDirections[randomDirection];

      // 2.1.2 Push the current Cell to the stack
      stack.push(currentICoords);

      // 2.1.3 Remove the wall between the current Cell and the chosen Cell
      const currentPosition: ICoords = {
        y: currentICoords.y + WALL_RELATIONS[(dir as keyof IPossibleMoves)].y,
        x: currentICoords.x + WALL_RELATIONS[(dir as keyof IPossibleMoves)].x
      };
      maze[currentPosition.y][currentPosition.x].tile = 'FLOOR';

      // 2.1.4 Make the chosen Cell the current Cell and mark it as visited
      const thisYFloor = currentICoords.y + POSSIBLE_MOVES[(dir as keyof IPossibleMoves)].y;
      const thisXFloor = currentICoords.x + POSSIBLE_MOVES[(dir as keyof IPossibleMoves)].x;
      currentICoords = maze[thisYFloor][thisXFloor];

      if (!(currentICoords.x && currentICoords.y)) {
        continue;
      }
      maze[currentICoords.y][currentICoords.x].visited = Status.HasVisited;
    }

    // 2.2 Else if stack is not empty
    else {
      // 2.2.1 Pop a Cell from the stack
      stack.pop();

      // 2.2.2 Make it the current Cell
        currentICoords = stack[stack.length - 1];
    }
  }
  return { cells: maze, width, height } ;
}
