import Position, { PositionInterface } from './Position';

export interface AppleInterface {
  appleSize: number;

  position: PositionInterface;

  draw: (ctx: CanvasRenderingContext2D, gridSize: number) => void;
}

class Apple implements AppleInterface {
  appleSize: number;

  position: PositionInterface;

  constructor(props) {
    const {
      appleSize = 0,
      position = new Position(40, 40),
    } = props;

    this.appleSize = appleSize;
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D, gridSize: number) {
    ctx.fillStyle = '#faf3e0';
    ctx.fillRect(
      this.position.x * gridSize,
      this.position.y * gridSize,
      this.appleSize * gridSize,
      this.appleSize * gridSize,
    );
  }
}

export default Apple;
