import { GRID_COUNT, GAME_SCREEN_WIDTH } from '../constants/snakeGame';
import { PositionInterface } from '../class/Position';

export interface MapInterface {
  rowSize: number;
  columnSize: number;
  centerPosition: PositionInterface;

  draw: (ctx: CanvasRenderingContext2D, gridSize: number) => void;
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

  draw(ctx: CanvasRenderingContext2D, gridSize: number) {
    ctx.strokeStyle = '#393b42';

    for (let row = 0; row < this.rowSize; row += 1) {
      ctx.beginPath();
      ctx.moveTo(row * gridSize, 0);
      ctx.lineTo(row * gridSize, this.rowSize * gridSize);
      ctx.stroke();
    }

    for (let column = 0; column < this.columnSize; column += 1) {
      ctx.beginPath();
      ctx.moveTo(0, column * gridSize);
      ctx.lineTo(this.columnSize * gridSize, column * gridSize);
      ctx.stroke();
    }
  }
}
