import { GRID_COUNT, GAME_SCREEN_WIDTH } from '../constants/snakeGame';
import { PositionInterface } from '../class/Position';

export interface MapInterface {
  rowSize: number;
  columnSize: number;
  centerPosition: PositionInterface;
}

export default class Map implements MapInterface {
  rowSize: number;

  columnSize: number;

  constructor() {
    this.rowSize = GRID_COUNT;
    this.columnSize = GRID_COUNT;
  }

  get centerPosition() {
    return {
      x: Math.floor(this.rowSize / 2) - 1,
      y: Math.floor(this.columnSize / 2) - 1,
    };
  }
}
