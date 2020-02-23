import { makeRandomMaze } from './make-random-maze';
import { prettyPrintMaze } from './pretty-print-maze';
import { findPath } from './find-path';
import { ISuccessfullPath } from './interfaces';

const randomMaze = makeRandomMaze(40, 20);
const pathStartToEnd = findPath(randomMaze, {x: 1, y: 1}, {x: 39, y: 19});

if(pathStartToEnd) {
  console.log(prettyPrintMaze(randomMaze, (pathStartToEnd as ISuccessfullPath)));
}
