import {
  GRID_SIZE, GRID_COUNT, GAME_SCREEN_WIDTH
} from '../constants/snakeGame';
import { PositionInterface } from '../class/Position';

export interface MapInterface {
  gridScreenWidth: number;
  rowSize: number;
  columnSize: number;
  gridSize: number;
  centerPosition: PositionInterface;
}

export default class Map implements MapInterface {
  gridScreenWidth: number;

  rowSize: number;

  columnSize: number;

  constructor() {
    this.gridScreenWidth = GAME_SCREEN_WIDTH;
    this.rowSize = GRID_COUNT;
    this.columnSize = GRID_COUNT;
  }

  get gridSize() {
    return Math.floor(this.gridScreenWidth / this.columnSize);
  }

  get centerPosition() {
    return {
      x: (Math.floor(this.rowSize / 2) - 1) * this.gridSize,
      y: (Math.floor(this.columnSize / 2) - 1) * this.gridSize,
    };
  }
}
