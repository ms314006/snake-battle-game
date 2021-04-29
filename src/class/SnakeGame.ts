import Map, { MapInterface } from './Map';
import Snake, { SnakeInterface } from './Snake';
import Apple, { AppleInterface } from './Apple';
import Position, { PositionInterface } from './Position';

interface SnakeGameInterface {
  map: MapInterface;
  isStartGame: boolean;
  isGameOver: boolean;
  apple: AppleInterface;
  snake: SnakeInterface;
  score: number;
  fps: number;

  generateNewApplePosition: () => PositionInterface;
  generateNextSnakePosition: () => PositionInterface;
}

class SnakeGame implements SnakeGameInterface {
  map: MapInterface;

  isStartGame: boolean;

  isGameOver: boolean;

  apple: AppleInterface;

  snake: SnakeInterface;

  fps: number;

  constructor(props) {
    this.map = new Map();
    const {
      isStartGame = false,
      isGameOver = false,
      apple = new Apple({
        appleSize: this.map.gridSize,
        position: new Position(this.map.gridSize, this.map.gridSize),
      }),
      snake = new Snake({
        bodySize: this.map.gridSize - 2,
        bodys: [new Position(this.map.centerPosition.x, this.map.centerPosition.y)],
      }),
      fps = 6,
    } = props || {};

    this.isStartGame = isStartGame;
    this.isGameOver = isGameOver;
    this.apple = new Apple(apple);
    this.snake = new Snake(snake);
    this.fps = fps;
  }

  get score() {
    return this.snake.tailLength - 1;
  }

  private isEmptyPosition(x: number, y: number) {
    return this.snake.bodys.every(
      snakeBody => snakeBody.x !== x || snakeBody.y !== y,
    );
  }

  generateNewApplePosition() {
    let { x, y } = this.apple.position;
    do {
      [x, y] = [
        Math.floor(Math.random() * this.map.columnSize) * this.map.gridSize,
        Math.floor(Math.random() * this.map.rowSize) * this.map.gridSize,
      ];
    } while (!this.isEmptyPosition(x, y));

    return new Position(x, y);
  }

  generateNextSnakePosition() {
    let { x, y } = this.snake.headPosition;

    x += this.snake.xDisplacement;
    y += this.snake.yDisplacement;

    if (x < 0) {
      x = this.map.gridScreenWidth - this.map.gridSize;
    }
    if (x > this.map.gridScreenWidth - 1) {
      x = 0;
    }
    if (y < 0) {
      y = this.map.gridScreenWidth - this.map.gridSize;
    }
    if (y > this.map.gridScreenWidth - 1) {
      y = 0;
    }
    return new Position(x, y);
  }
}

export default SnakeGame;
