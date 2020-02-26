# Mazes are amazing

This project attempts to implement a maze generator and solver using Depth-first Search
and Breadth-first Search.

* Using Depth-first Search, mazes with a random structure is generated.
Comments in code [from Wikipedia](https://en.wikipedia.org/wiki/Depth-first_search).

* Using Breadth-first Search, a path from the beginning to the end is (hopefully) found. Comments in code [from Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search).

## Usage

```
npm install

npm run build

npm run demo

```

## Output

![](./demo-screenshot.png)


## Short explanation

By use of Depth-first Search we shall create a maze generator. I will use TypeScript.

### Helpers

Let's begin by generating an empty 'map' which later will be populated by our maze. Each 'visitable' cell should be surrounded by unvisitable, thus creating a grid.

We want the grid to frame the maze. Therefore we need the grid to be of uneven width and height.  For this, we will also need some small utility helpers.

```
enum Status {
  HasVisited,
  HasNotVisited,
}

interface ICell {
  tile: string;
  visited: Status;
  x: number;
  y: number;
}

interface ICoords {
  x: number;
  y: number;
}

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
            y,
          }
        : {
            tile: 'FLOOR',
            visited: Status.HasNotVisited,
            x,
            y,
          },
    ),
  );
}
```

### Exploration. One step at the time

The DFS algorithm operates by making a graph out of data. This graphs structure is determined by how we move between nodes
and what counts as a node.

This maze will use straight angles (90 degrees) and
therefore there are four possible directions (up, right, down, left), four
ways of moving about between one node and another.

Say this is the first node (X), positioned at a random x/y in a 2d array of
unknown size:

```
+---+---+---+---+---+---+---+---+
| o | o | o | o | o | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |   | o |(1)| o |   | o |
+---+---+---+---+---+---+---+---+
| o | o | o | o | o | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |(4)| o | X | o |(2)| o |
+---+---+---+---+---+---+---+---+
| o | o | o | o | o | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |   | o |(3)| o |   | o |
+---+---+---+---+---+---+---+---+
```

No other nodes have been visited. From this position, we move in a
random direction. The randomizer decided upon 'up' and we remove the wall X and (1) and populate (1) and wall with x's. 

```
+---+---+---+---+---+---+---+---+
| o | o | o | o | o | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |(1)| o | x | o |(2)| o |
+---+---+---+---+---+---+---+---+
| o | o | o | o | x | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |   | o | x | o |   | o |
+---+---+---+---+---+---+---+---+
| o | o | o | o | o | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |   | o |   | o |   | o |
+---+---+---+---+---+---+---+---+
```

Let's suppose that the wall at the top och and left constitute the
'map' border. Because we've already visited the node underneath, we can
only move right or left. Or rather, because we can go right
and left we don't have to backtrack to the initial position and move in
another direction.

```
+---+---+---+---+---+---+---+---+
| o | o | o | o | o | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |   | o | x | x | x | o |
+---+---+---+---+---+---+---+---+
| o | o | o | o | x | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |   | o | x | o |   | o |
+---+---+---+---+---+---+---+---+
| o | o | o | o | o | o | o | o |
+---+---+---+---+---+---+---+---+
|   | o |   | o |   | o |   | o |
+---+---+---+---+---+---+---+---+
```

The randomizer decided we move right. From here we can continue moving to the right or move in a downward direction. Now we randomize a new direction. 

As long as an unvisited node is at hand, this continues. If
not, we go back (we pop the last node in the stack) until we find a node from where we can go to an unvisited node. When we have no node that can be visited pilled in the stack, a maze has emerged.

### Making the Maze


We will traverse the maze by 'walking' in different directions. We move from a visitable cell of the maze to another visitable cell. In doing this, we 'jump' an unvisitable cell. As we move the wall between two visitable cells will be ground. From the start, only the point of departure was of type floor. To walk means to connect visitable cells of type floor by removing walls by changing the type to floor.

```
type RelativeICoords = Pick<ICoords, 'x' | 'y'>;

interface IPossibleMoves {
  up: RelativeICoords;
  down: RelativeICoords;
  left: RelativeICoords;
  right: RelativeICoords;
}

const POSSIBLE_MOVES: IPossibleMoves = {
  up:    { y: -2, x: 0  },
  right: { y: 0,  x: 2  },
  down:  { y: 2,  x: 0  },
  left:  { y: 0,  x: -2 },
};

const WALL_RELATIONS: IPossibleMoves = {
  up:    { y: -1, x: 0  },
  right: { y: 0,  x: 1  },
  down:  { y: 1,  x: 0  },
  left:  { y: 0,  x: -1 },
};
```

We start at a random visitable cell located at a position x/y, generated by the use of our `startCoords`. This position - the venture point - is set to have been visited.

Our starting position is the first element of the stack, a pile of visited nodes which we use for walking back if needed. Eventually, we'll end
up at a node from where no visitable nodes are reachable and no more generation is needed.

```
interface IMaze {
  cells: ICell[][];
  width: number;
  height: number;
}

function makeRandomMaze(w: number, h: number): IMaze {
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
```

Because we have walls between each floor cell from the beginning we each peek at what neighbors are visitable with a distance of two cells, as specified by our data structure. 

By use of a filter, we obtain what particular directions are
available from the current cell position.

``` {.js}

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
  return Object.keys(POSSIBLE_MOVES).filter(dir => isValid(dir as keyof IPossibleMoves)) || [];
}


```

If some cells are visitable we choose a random one and push it to the
stack.
```
while (stack.length !== 0) {

    const availableDirections = whichDirectionsArePossible(
      maze,
      { x: currentICoords.x, y: currentICoords.y },
      width,
      height,
    );

    // 2.1 If the current Cell has any neighbours which have not been visited
    if (availableDirections.length > 0) {
      // 2.1.1 Choose randomly one of the unvisited neighbours
      const randomDirection = randomInt(availableDirections.length);
      const dir = availableDirections[randomDirection];

```

Since the next visitable cell in the stack already is of type floor, we
need to remove the wall in between. We set the wall to be of
type floor. 

```
// 2.1.3 Remove the wall between the current Cell and the chosen Cell
      const currentPosition: ICoords = {
        y: currentICoords.y + WALL_RELATIONS[dir as keyof IPossibleMoves].y,
        x: currentICoords.x + WALL_RELATIONS[dir as keyof IPossibleMoves].x,
      };
      maze[currentPosition.y][currentPosition.x].tile = 'FLOOR';
```

The next cell - the one peaked at - is set to the current one. We'll
also mark it as visited. This completes a step.

```
      // 2.1.4 Make the chosen Cell the current Cell and mark it as visited
      const thisYFloor = currentICoords.y + POSSIBLE_MOVES[dir as keyof IPossibleMoves].y;
      const thisXFloor = currentICoords.x + POSSIBLE_MOVES[dir as keyof IPossibleMoves].x;
      currentICoords = maze[thisYFloor][thisXFloor];

      if (!(currentICoords.x && currentICoords.y)) {
        continue;
      }
      maze[currentICoords.y][currentICoords.x].visited = Status.HasVisited;
    }
```

If no cells are visitable from the current position of the stack (the
last), we `pop` one element (and in the next iteration checks if it has
any visitable neighbors... until the end of the stack). We finish by
returning our maze as well as its width and height.

```
// 2.2 Else if stack is not empty
    else {
      // 2.2.1 Pop a Cell from the stack
      stack.pop();

      // 2.2.2 Make it the current Cell
      currentICoords = stack[stack.length - 1];
    }
  }
  return { cells: maze, width, height };
}
```

### Find a way

Our function for finding a path in a maze will receive two positions,
a node containing the x/y for where to start and another node for where to go.

Will proceed from our start position and check if it possible to walk
to a neighbor, if so we populate and continue... step by step until we have found the end node or we have visited all nodes we can visit (without finding it).

In these diagrams where we start from is marked by S and our end node is marked by E. p is a node possible to visit, and x is an already visited node.

### 1
```
+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   |   | ▓ |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   | p | ▓ |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   | p | S | ▓ | E |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   | p |   |   |   |   |
+---+---+---+---+---+---+---+---+
```

### 2
```
+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   | p | ▓ |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   | p | x | ▓ |   |   |   |
+---+---+---+---+---+---+---+---+
|   | p | x | S | ▓ | E |   |   |
+---+---+---+---+---+---+---+---+
|   |   | p | x | p |   |   |   |
+---+---+---+---+---+---+---+---+
```

### 3
```
+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   | p |   |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   | p | x | ▓ |   |   |   |
+---+---+---+---+---+---+---+---+
|   | p | x | x | ▓ |   |   |   |
+---+---+---+---+---+---+---+---+
| p | x | x | S | ▓ | E |   |   |
+---+---+---+---+---+---+---+---+
|   | p | x | x | x | p |   |   |
+---+---+---+---+---+---+---+---+

```

We can concretize this by making a stack and pushing our start node to it.


```
interface IPathNode {
  x: number;
  y: number;
  status: string;
  path: ICoords[];
}

interface ISuccessfullPath {
  path: ICoords[];
  endCoordinates: ICoords;
  startCoordinates: ICoords;
}

function findPath(
  maze: IMaze, 
  startCoordinates: ICoords, 
  endCoordinates: ICoords
): ISuccessfullPath | false {
  // let Q be a queue, label start_v as discovered, Q.enqueue(start_v)
  const queue: IPathNode[] = [
    {
      y: startCoordinates.y,
      x: startCoordinates.x,
      path: [],
      status: 'Known',
    },
  ];
```

We check if the start and end node are of type floor (otherwise the path is impossible).

```
  if (
    maze.cells[endCoordinates.y][endCoordinates.x].tile !== 'FLOOR' ||
    maze.cells[startCoordinates.y][startCoordinates.x].tile !== 'FLOOR'
  ) {
    return false;
  }
```

By walking in all possible directions at every given border-case we map out unknown territory. We do this continuously, for every iteration pushing the border one step further until we have found the end node or until no part of the border is possible to expand. 

```
  const cells = [...maze.cells];
  // while Q is not empty
  while (queue.length > 0) {
    //  v = Q.dequeue()
    const currentLocation = queue.shift();
    if (currentLocation === undefined) {
      throw new Error('Current location is undefined.');
    }
    for (const dir of ['up', 'right', 'down', 'left']) {
      const newPath = currentLocation.path.slice();
      newPath.push({ x: currentLocation.x, y: currentLocation.y });

      const x = currentLocation.x + WALL_RELATIONS[dir as keyof IPossibleMoves].x;
      const y = currentLocation.y + WALL_RELATIONS[dir as keyof IPossibleMoves].y;

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
      if (newLocation.x < 0 
        || newLocation.x >= maze.width 
        || newLocation.y < 0 
        || newLocation.y >= maze.height) {
        newLocation.status = 'Invalid';
      } else if (newLocation.y === endCoordinates.y 
        && newLocation.x === endCoordinates.x) {
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
```
