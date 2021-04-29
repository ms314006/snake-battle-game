export interface PositionInterface {
  x: number;
  y: number;
}

class Position implements PositionInterface {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export default Position;
