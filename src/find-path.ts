import { ICoords, IMaze, IPathNode, ISuccessfullPath } from './interfaces';
import { WALL_RELATIONS } from './constants';

export function findPath(
  maze: IMaze,
  startCoordinates: ICoords,
  endCoordinates: ICoords
): ISuccessfullPath | boolean {
  // let Q be a queue, label start_v as discovered, Q.enqueue(start_v)
  const queue: IPathNode[] = [{
    y: startCoordinates.y,
    x: startCoordinates.x,
    path: [],
    status: 'Known',
  }];

  if ( maze.cells[endCoordinates.y][endCoordinates.x].tile !== 'FLOOR'
      || maze.cells[startCoordinates.y][startCoordinates.x].tile !== 'FLOOR') {
    return false;
  }

  const cells = [...maze.cells];
  // while Q is not empty
  while (queue.length > 0) {

    //  v = Q.dequeue()
    const currentLocation = queue.shift();

    for (const dir of ['up', 'right', 'down', 'left']) {
      const newPath = currentLocation.path.slice();
      newPath.push({ x: currentLocation.x, y: currentLocation.y});

      const x = currentLocation.x + WALL_RELATIONS[dir].x;
      const y = currentLocation.y + WALL_RELATIONS[dir].y;

      const newLocation: IPathNode = {
        x,
        y,
        path: newPath,
        status: 'Unknown',
      };

      /*
       *
      if v is the goal:
          return v
      for all edges from v to w in G.adjacentEdges(v) do
          if w is not labeled as discovered:
              label w as discovered
              w.parent = v
              Q.enqueue(w)
      */
      if (
        newLocation.x < 0 ||
        newLocation.x >= maze.width ||
        newLocation.y < 0 ||
        newLocation.y >= maze.height
      ) {
        newLocation.status = 'Invalid';
      } else if (newLocation.y === endCoordinates.y && newLocation.x === endCoordinates.x) {
        newLocation.status = 'Goal';
        return { path: newLocation.path, startCoordinates, endCoordinates };
      } else if (cells[newLocation.y][newLocation.x].tile !== 'FLOOR') {
        newLocation.status = 'Blocked';
      } else {
        newLocation.status = 'Valid';
        cells[newLocation.y][newLocation.x].tile = ' ';
        queue.push(newLocation);
      }
    }
  }
  return false;
}
