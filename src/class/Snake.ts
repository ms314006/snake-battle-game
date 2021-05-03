import { PositionInterface } from './Position';

export interface SnakeInterface {
  bodySize: number;
  bodys: PositionInterface[];

  draw: (ctx: CanvasRenderingContext2D, gridSize: number) => void;
}

class Snake implements SnakeInterface {
  bodySize: number;

  bodys: PositionInterface[];

  currentMoveDirection: number | null = null;

  constructor(props) {
    const {
      bodySize = 0,
      bodys = []
    } = props;
    this.bodySize = bodySize;
    this.bodys = bodys;
  }

  draw(ctx: CanvasRenderingContext2D, gridSize: number) {
    ctx.fillStyle = '#eabf9f';
    this.bodys.forEach((body) => {
      const { x: snakeBodyPositionX, y: snakeBodyPositionY } = body;
      ctx.fillRect(
        (snakeBodyPositionX * gridSize) + 1,
        (snakeBodyPositionY * gridSize) + 1,
        (this.bodySize * gridSize) - 2,
        (this.bodySize * gridSize) - 2,
      );
    });
  }
}

export default Snake;
