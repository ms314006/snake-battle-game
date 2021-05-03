import Map, { MapInterface } from './Map';
import Snake, { SnakeInterface } from './Snake';
import Apple, { AppleInterface } from './Apple';
import Position, { PositionInterface } from './Position';

interface SnakeGameInterface {
  map: MapInterface;
  isStartGame: boolean;
  isEndGame: boolean;
  isWinner: boolean;
  apple: AppleInterface;
  snake: SnakeInterface;
  score: number;
  fps: number;
}

class SnakeGame implements SnakeGameInterface {
  map: MapInterface;

  isStartGame: boolean;

  isEndGame: boolean;

  isWinner: boolean;

  apple: AppleInterface;

  snake: SnakeInterface;

  fps: number;

  constructor(props) {
    this.map = new Map();
    const {
      isStartGame = false,
      isEndGame = false,
      isWinner = false,
      apple = new Apple({
        appleSize: 1,
        position: new Position(2, 2),
      }),
      snake = new Snake({
        bodySize: 1,
        bodys: [new Position(this.map.centerPosition.x, this.map.centerPosition.y)],
      }),
      fps = 6,
    } = props || {};

    this.isStartGame = isStartGame;
    this.isEndGame = isEndGame;
    this.isWinner = isWinner;
    this.apple = new Apple(apple);
    this.snake = new Snake(snake);
    this.fps = fps;
  }

  get score() {
    return this.snake.tailLength - 1;
  }
}

export default SnakeGame;
