import Position, { PositionInterface } from './Position';

export interface AppleInterface {
  appleSize: number;

  position: PositionInterface;

  draw: (ctx: CanvasRenderingContext2D) => void;
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#faf3e0';
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.appleSize,
      this.appleSize,
    );
  }
}

export default Apple;
