import Position, { PositionInterface } from './Position';

export interface SnakeInterface {
  bodySize: number;
  bodys: PositionInterface[];
  tailLength: number;
  xDisplacement: number;
  yDisplacement: number;
  currentMoveDirection: number | null;
  headPosition: Position;

  isAteApple: (apple: PositionInterface) => boolean;
  isTouchBody: (newSnakeHeadPosition: PositionInterface) => boolean;
  addLength: (increaseLength: number) => void;
  setDisplacement: (x: number, y: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

class Snake implements SnakeInterface {
  bodySize: number;

  bodys: PositionInterface[];

  tailLength: number;

  xDisplacement: number;

  yDisplacement: number;

  currentMoveDirection: number | null = null;

  constructor(props) {
    const {
      bodySize = 0,
      bodys = [],
      tailLength = 1,
    } = props;
    this.bodySize = bodySize;
    this.bodys = bodys;
    this.tailLength = tailLength;
    this.xDisplacement = 0;
    this.yDisplacement = 0;
    this.currentMoveDirection = null;
  }

  get headPosition() {
    return new Position(
      this.bodys[this.bodys.length - 1].x,
      this.bodys[this.bodys.length - 1].y,
    );
  }

  set headPosition(headPosition: PositionInterface) {
    this.bodys = [...this.bodys, headPosition];
    while (this.bodys.length > this.tailLength) {
      this.bodys.shift();
    }
  }

  isAteApple(apple: PositionInterface) {
    return this.headPosition.x === apple.x && this.headPosition.y === apple.y;
  }

  isTouchBody(newSnakeHeadPosition: PositionInterface) {
    const isSnakeHeadTouchBody = (snakeBodyX: number, snakeBodyY: number) => (
      snakeBodyX === newSnakeHeadPosition.x && snakeBodyY === newSnakeHeadPosition.y
    );

    return this.bodys.some(body => (
      isSnakeHeadTouchBody(body.x, body.y)
    ));
  }

  addLength(increaseLength: number) {
    this.tailLength += increaseLength;
  }

  setDisplacement(x: number, y: number) {
    this.xDisplacement = x;
    this.yDisplacement = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#eabf9f';
    this.bodys.forEach((body) => {
      const { x: snakeBodyPositionX, y: snakeBodyPositionY } = body;
      ctx.fillRect(
        snakeBodyPositionX + 1,
        snakeBodyPositionY + 1,
        this.bodySize,
        this.bodySize,
      );
    });
  }
}

export default Snake;
