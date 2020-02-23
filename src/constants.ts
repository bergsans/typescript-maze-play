import { IPossibleMoves } from './interfaces';

export const POSSIBLE_MOVES: IPossibleMoves = {
  up: { y: -2, x: 0 },
  right: { y: 0, x: 2 },
  down: { y: 2, x: 0 },
  left: { y: 0, x: -2 },
};

export const WALL_RELATIONS: IPossibleMoves = {
  up: { y: -1, x: 0 },
  right: { y: 0, x: 1 },
  down: { y: 1, x: 0 },
  left: { y: 0, x: -1 },
};

export const WALLS = [
  {
    conditions: { left: false, right: false, up: true, down: true },
    representation: '│',
  },
  {
    conditions: { left: false, right: false, up: true, down: false },
    representation: '╽',
  },
  {
    conditions: { left: false, right: false, up: false, down: true },
    representation: '╿',
  },
  {
    conditions: { left: false, right: true, up: false, down: false },
    representation: '╾',
  },
  {
    conditions: { left: true, right: false, up: false, down: false },
    representation: '╼',
  },
  {
    conditions: { left: true, right: true, up: true, down: true },
    representation: '┼',
  },
  {
    conditions: { left: true, right: true, up: false, down: false },
    representation: '─',
  },
  {
    conditions: { left: false, right: true, up: false, down: true },
    representation: '┌',
  },
  {
    conditions: { left: true, right: false, up: true, down: false },
    representation: '┘',
  },
  {
    conditions: { left: false, right: true, up: true, down: false },
    representation: '└',
  },
  {
    conditions: { left: true, right: false, up: false, down: true },
    representation: '┐',
  },
  {
    conditions: { left: true, right: false, up: true, down: true },
    representation: '┤',
  },
  {
    conditions: { left: false, right: true, up: true, down: true },
    representation: '├',
  },
  {
    conditions: { left: true, right: true, up: true, down: false },
    representation: '┴',
  },
  {
    conditions: { left: true, right: true, up: false, down: true },
    representation: '┬',
  },
];
